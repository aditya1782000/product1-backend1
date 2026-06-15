import { Transform } from 'stream';
import Statement, { IStatementData } from '../models/statements';
import fs from 'fs';
import { parse } from 'csv-parse';
import mongoose from 'mongoose';

export function storeStatements(
    filePath: string,
    organization: mongoose.Types.ObjectId,
): Promise<{ success: boolean; message: string; data?: unknown }> {
    return new Promise((resolve, reject) => {
        try {
            const ledgers: Record<
                string,
                {
                    name: string;
                    address: string;
                    data: IStatementData[];
                }
            > = {};
            let currentLedgerName = '';
            let currentLedgerAddress = '';
            let dateRange = '';
            let isProcessingLedgerData = false;
            let isProcessingAddress = false;
            let headerFound = false;

            const fileContent = fs.readFileSync(filePath, 'utf8');
            if (!fileContent || fileContent.trim().length === 0) {
                throw new Error('The uploaded file is empty');
            }

            const parser = parse({
                columns: false,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true,
            });

            const transformer = new Transform({
                objectMode: true,
                transform(chunk, _encoding, callback) {
                    const row = chunk;

                    if (
                        row[0] &&
                        row[0].match(
                            /^\d{1,2}-[A-Za-z]{3}-\d{2} to \d{1,2}-[A-Za-z]{3}-\d{2}$/,
                        ) &&
                        !dateRange
                    ) {
                        dateRange = row[0].trim();
                        callback(null, null);
                        return;
                    }

                    if (row[0] === 'Ledger:' && row.length > 1) {
                        isProcessingLedgerData = true;
                        isProcessingAddress = true;
                        headerFound = false;
                        currentLedgerName = row[1]?.split(',')[0]?.trim() || '';
                        currentLedgerAddress = '';

                        if (currentLedgerName) {
                            ledgers[currentLedgerName] = {
                                name: currentLedgerName,
                                address: '',
                                data: [],
                            };
                        }
                        callback(null, null);
                        return;
                    }

                    if (
                        isProcessingLedgerData &&
                        isProcessingAddress &&
                        currentLedgerName &&
                        !row.includes('Date') &&
                        row[0] !== 'Ledger:'
                    ) {
                        const addressPart = row
                            .filter(
                                (part: string) => part && part.trim() !== '',
                            )
                            .join(', ')
                            .trim();
                        if (addressPart) {
                            currentLedgerAddress +=
                                (currentLedgerAddress ? ' ' : '') + addressPart;
                        }
                        if (ledgers[currentLedgerName]) {
                            ledgers[currentLedgerName].address =
                                currentLedgerAddress;
                        }
                        callback(null, null);
                        return;
                    }

                    if (
                        isProcessingLedgerData &&
                        !headerFound &&
                        row.includes('Date')
                    ) {
                        headerFound = true;
                        isProcessingAddress = false;
                        callback(null, null);
                        return;
                    }

                    if (
                        isProcessingLedgerData &&
                        headerFound &&
                        currentLedgerName &&
                        row.length > 4
                    ) {
                        if (row[0] === 'By' && row[1] === 'Closing Balance') {
                            callback(null, null);
                            return;
                        }

                        if (
                            !row[0] ||
                            row.every(
                                (cell: unknown) =>
                                    cell === '' ||
                                    cell === ',' ||
                                    cell === undefined,
                            )
                        ) {
                            callback(null, null);
                            return;
                        }

                        try {
                            const datePattern = /^\d{2}-[A-Za-z]{3}-\d{2}$/;
                            if (!datePattern.test(row[0])) {
                                callback(null, null);
                                return;
                            }

                            let direction = '';
                            if (row[1] === 'To') direction = 'To';
                            else if (row[1] === 'By') direction = 'By';

                            let debitValue: number | undefined = undefined;
                            let creditValue: number | undefined = undefined;

                            if (row[5] && row[5] !== '') {
                                debitValue = parseFloat(
                                    row[5].toString().replace(/,/g, ''),
                                );
                                if (isNaN(debitValue)) debitValue = undefined;
                            }

                            if (row[6] && row[6] !== '') {
                                creditValue = parseFloat(
                                    row[6].toString().replace(/,/g, ''),
                                );
                                if (isNaN(creditValue)) creditValue = undefined;
                            }

                            const statementData: IStatementData = {
                                date: parseDate(row[0]),
                                direction: direction,
                                particulars: row[2] || '',
                                vchType: row[3] || '',
                                vchNo: row[4] || '',
                                debit: debitValue,
                                credit: creditValue,
                            } as IStatementData;

                            ledgers[currentLedgerName].data.push(statementData);
                        } catch (err) {
                            console.error(
                                'Error processing transaction row:',
                                err,
                            );
                        }
                    }

                    callback(null, null);
                },
            });

            fs.createReadStream(filePath)
                .pipe(parser)
                .pipe(transformer)
                .on('finish', async () => {
                    try {
                        const savedLedgers = [];

                        for (const [ledgerName, ledgerInfo] of Object.entries(
                            ledgers,
                        )) {
                            if (ledgerInfo.data.length > 0) {
                                if (!ledgerName || !ledgerInfo.address) {
                                    console.error(
                                        `Skipping ledger ${ledgerName} due to missing name or address`,
                                    );
                                    continue;
                                }

                                const existingStatement =
                                    await Statement.findOne({
                                        organization: organization,
                                        organizationName: ledgerName,
                                    });

                                if (existingStatement) {
                                    const existingDates = new Set(
                                        existingStatement.statementData.map(
                                            (item) =>
                                                item.date.toISOString() +
                                                item.particulars +
                                                (item.vchNo || '') +
                                                (item.debit?.toString() || '') +
                                                (item.credit?.toString() || ''),
                                        ),
                                    );

                                    const newData = ledgerInfo.data.filter(
                                        (item) => {
                                            const itemkey =
                                                item.date.toISOString() +
                                                item.particulars +
                                                (item.vchNo || '') +
                                                (item.debit?.toString() || '') +
                                                (item.credit?.toString() || '');
                                            return !existingDates.has(itemkey);
                                        },
                                    );

                                    if (newData.length > 0) {
                                        existingStatement.statementData = [
                                            ...existingStatement.statementData,
                                            ...newData,
                                        ];

                                        await existingStatement.save();

                                        savedLedgers.push({
                                            name: ledgerName,
                                            totalTransactions: newData.length,
                                            id: existingStatement._id,
                                            isExisting: true,
                                        });
                                    } else {
                                        savedLedgers.push({
                                            name: ledgerName,
                                            totalTransactions: 0,
                                            id: existingStatement._id,
                                            isExisting: true,
                                            noNewData: true,
                                        });
                                    }
                                } else {
                                    const statement = await Statement.create({
                                        organization: organization,
                                        organizationName: ledgerName,
                                        organizationAddress: ledgerInfo.address,
                                        statementData: ledgerInfo.data,
                                    });

                                    savedLedgers.push({
                                        name: ledgerName,
                                        totalTransactions:
                                            ledgerInfo.data.length,
                                        id: statement._id,
                                    });
                                }
                            }
                        }

                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(
                                    `Error deleting file: ${filePath}`,
                                    err,
                                );
                            }
                        });

                        resolve({
                            success: true,
                            message: 'Statements stored successfully.',
                            data: {
                                dateRange,
                                ledgers: savedLedgers,
                            },
                        });
                    } catch (error) {
                        console.error('Error saving statements:', error);
                        reject({
                            success: false,
                            message:
                                error instanceof Error
                                    ? error.message
                                    : 'Unknown error',
                        });
                    }
                })
                .on('error', (error) => {
                    console.error('Stream error:', error);
                    reject({
                        success: false,
                        message: error.message || 'Error processing file',
                    });
                });
        } catch (error: unknown) {
            console.error('General error:', error);
            reject({
                success: false,
                message:
                    error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
}

const parseDate = (dateStr: string): Date => {
    try {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return new Date();

        const day = parseInt(parts[0], 10);
        const monthMap: Record<string, number> = {
            Jan: 0,
            Feb: 1,
            Mar: 2,
            Apr: 3,
            May: 4,
            Jun: 5,
            Jul: 6,
            Aug: 7,
            Sep: 8,
            Oct: 9,
            Nov: 10,
            Dec: 11,
        };
        const month = monthMap[parts[1]] || 0;
        const year = 2000 + parseInt(parts[2], 10);

        return new Date(Date.UTC(year, month, day, 0, 0, 0));
    } catch (error) {
        console.error('Error parsing date:', dateStr, error);
        return new Date();
    }
};
