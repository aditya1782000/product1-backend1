import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import { storeStatements } from '../../utils/csvParse';
import { Request } from 'express';
import fs from 'fs';
import Statement from '../../models/statements';
import dataTable from '../../utils/dataTable';

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

export const addStatements = async (
    req: Request,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        if (!req.file) {
            return {
                statusCode: 400,
                success: false,
                message: 'No file uploaded',
            };
        }

        const filePath = req.file.path;

        await storeStatements(filePath, organisation);

        return {
            statusCode: 200,
            success: true,
            message: 'Statements added successfully',
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    } finally {
        if (req?.file?.path) {
            deleteTempFile(req?.file?.path);
        }
    }
};

export const listStatements = async (
    organizationName: string,
    organisation: mongoose.Types.ObjectId,
    from: Date,
    to: Date,
): Promise<AsyncResponseType> => {
    try {
        const statement = await Statement.findOne({
            organizationName: organizationName,
            organization: organisation,
        });

        if (!statement) {
            return {
                statusCode: 404,
                success: false,
                message: 'Statements not found',
            };
        }

        const filteredStatements = statement.statementData.filter(
            (data) => data.date >= from && data.date <= to,
        );

        const creditTotal = filteredStatements.reduce(
            (total, item) => total + (item.credit || 0),
            0,
        );

        const debitTotal = filteredStatements.reduce(
            (total, item) => total + (item.debit || 0),
            0,
        );

        const closingBalance =
            debitTotal > creditTotal
                ? debitTotal - creditTotal
                : creditTotal - debitTotal;

        const closingBalanceDirection =
            debitTotal > creditTotal
                ? 'By'
                : creditTotal > debitTotal
                  ? 'To'
                  : 'null';

        return {
            statusCode: 200,
            success: true,
            message: 'Statements retrieved successfully',
            data: {
                organizationName: statement.organizationName,
                organizationAddress: statement.organizationAddress,
                filteredStatements,
                creditTotal,
                debitTotal,
                closingBalance,
                closingBalanceDirection,
            },
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const listStatementOrganizationNames = async (
    req: Request,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['organizationName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const orgName = await Statement.find({
            $and: [oData.oSearchData],
            organization: organisation,
        })
            .select('organizationName')
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Statement organization retrieved successfully',
            data: orgName,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};
