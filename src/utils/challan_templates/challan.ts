import PDFDocument from 'pdfkit';

interface DeliverySlip {
    gstNo?: string;
    mobileNo?: number;
    headingOne?: string;
    headingTwo?: string;
    addressLineOne?: string;
    addressLineTwo?: string;
    slipNo: string;
    date: string;
    name: string;
    address: string;
    items: {
        particulars: string;
        description?: string; 
        qty: number;
        rate: number;
    }[];
    total: number;
    footer?: string;
    note?: string;
    logoPath?: string;
}

class PDFHelper {
    private doc: PDFKit.PDFDocument;
    private totalQty: number = 0;
    private readonly margin = 20;
    private readonly pageHeight = 595;
    private readonly slipWidth = (842 - 60) / 2;
    private readonly maxItemsPerPage = 8;
    private items?: DeliverySlip['items'];
    private total?: number;

    constructor(doc: PDFKit.PDFDocument) {
        this.doc = doc;
    }

    generateDualSlips(data: DeliverySlip) {
        const totalItems = data.items.length;
        const totalPages = Math.ceil(totalItems / this.maxItemsPerPage);
        this.totalQty = data.items.reduce(
            (sum, item) => sum + Number(item.qty),
            0,
        );
        for (let page = 0; page < totalPages; page++) {
            if (page > 0) {
                this.doc.addPage();
            }

            const startIdx = page * this.maxItemsPerPage;
            const endIdx = Math.min(
                startIdx + this.maxItemsPerPage,
                totalItems,
            );
            const pageItems = data.items.slice(startIdx, endIdx);

            const pageSubtotal = pageItems.reduce(
                (sum, item) => sum + item.qty * item.rate,
                0,
            );

            const pageData = {
                ...data,
                items: pageItems,
                total: page === totalPages - 1 ? data.total : pageSubtotal,
                slipNo:
                    totalPages > 1
                        ? `${data.slipNo} (Page ${page + 1}/${totalPages})`
                        : data.slipNo,
            };

            this.generateSingleSlip(pageData, 0, page === totalPages - 1);
            this.generateSingleSlip(
                pageData,
                this.slipWidth + 20,
                page === totalPages - 1,
            );
        }

        return this;
    }

    private generateSingleSlip(
        data: DeliverySlip,
        xOffset: number,
        isLastPage: boolean,
    ) {
        this.drawOuterBox(xOffset)
            .drawHeader(
                data.gstNo || '',
                data.mobileNo || 0,
                data.headingOne || '',
                data.headingTwo || '',
                data.addressLineOne || '',
                data.addressLineTwo || '',
                data.logoPath || '',
                xOffset,
            )
            .drawSlipDetails(data.slipNo, data.date, xOffset)
            .drawCustomerInfo(data.name, data.address, xOffset)
            .setItems(data.items)
            .setTotal(data.total)
            .drawTable(xOffset, isLastPage)
            .drawFooter(xOffset, data.footer || '', data.note || '', isLastPage)
            .drawWatermark(xOffset, data.logoPath);
    }

    private drawOuterBox(xOffset: number) {
        this.doc
            .rect(
                this.margin + xOffset,
                this.margin,
                this.slipWidth,
                this.pageHeight - this.margin * 2,
            )
            .stroke();
        return this;
    }

    private drawHeader(
        gstNo: string,
        mobileNo: number,
        headingOne: string,
        headingTwo: string,
        addressLineOne: string,
        addressLineTwo: string,
        logoPath: string,
        xOffset: number,
    ) {
        const headerTop = this.margin + 10;
        const boxStart = this.margin + xOffset;
        const boxWidth = this.slipWidth;

        this.doc
            .fontSize(10)
            .text(`GSTN. : ${gstNo}`, boxStart + 10, headerTop)
            .text(`Mobile No.: ${mobileNo}`, boxStart + 10, headerTop + 15);

        const rightSectionStart = boxStart + boxWidth - 235;

        if (logoPath) {
            const logoWidth = 50;
            const logoHeight = 50;
            const logoX = rightSectionStart;
            const logoY = headerTop;

            try {
                this.doc.image(logoPath, logoX, logoY, {
                    width: logoWidth,
                    height: logoHeight,
                });
            } catch (error) {
                console.error('Error loading logo:', error);
            }

            const headingsStart = logoX + logoWidth + 20;

            this.doc
                .fontSize(20)
                .text(headingOne, headingsStart, headerTop, {
                    width: 250,
                    align: 'left',
                })
                .fontSize(14)
                .text(headingTwo, headingsStart, headerTop + 25, {
                    width: 250,
                    align: 'left',
                })
                .fontSize(10)
                .text(addressLineOne, headingsStart, headerTop + 45, {
                    width: 250,
                    align: 'left',
                })
                .text(addressLineTwo, headingsStart, headerTop + 60, {
                    width: 250,
                    align: 'left',
                });
        } else {
            const rightSection = boxStart + boxWidth - 165;

            this.doc
                .fontSize(20)
                .text(headingOne, rightSection, headerTop, {
                    width: 300,
                    align: 'left',
                })
                .fontSize(14)
                .text(headingTwo, rightSection, headerTop + 25, {
                    width: 300,
                    align: 'left',
                })
                .fontSize(10)
                .text(addressLineOne, rightSection, headerTop + 45, {
                    width: 300,
                    align: 'left',
                })
                .text(addressLineTwo, rightSection, headerTop + 60, {
                    width: 300,
                    align: 'left',
                });
        }
        this.drawHorizontalLine(headerTop + 90, xOffset);

        return this;
    }

    private drawSlipDetails(slipNo: string, date: string, xOffset: number) {
        const slipTop = this.margin + 110;

        this.doc
            .fontSize(10)
            .text('D. Slip No :', this.margin + 10 + xOffset, slipTop, {
                width: 80,
            })
            .text(slipNo, this.margin + 60 + xOffset, slipTop, {
                width: this.slipWidth / 2 - 100,
            })
            .text(
                'Date :',
                this.margin + xOffset + this.slipWidth - 90,
                slipTop,
                {
                    width: 50,
                },
            )
            .text(date, this.margin + xOffset + this.slipWidth - 100, slipTop, {
                width: 90,
                align: 'right',
            });

        this.drawHorizontalLine(slipTop + 20, xOffset);
        return this;
    }

    private drawCustomerInfo(name: string, address: string, xOffset: number) {
        const infoTop = this.margin + 140;

        this.doc
            .text('Name :', this.margin + 10 + xOffset, infoTop, {
                width: 80,
            })
            .text(name, this.margin + 60 + xOffset, infoTop, {
                width: this.slipWidth - 100,
            });

        this.drawHorizontalLine(infoTop + 20, xOffset);

        this.doc
            .text('Address :', this.margin + 10 + xOffset, infoTop + 30, {
                width: 80,
            })
            .text(address, this.margin + 60 + xOffset, infoTop + 30, {
                width: this.slipWidth - 100,
            });

        this.drawHorizontalLine(infoTop + 50, xOffset);
        return this;
    }

    private drawTable(xOffset: number, isLastPage: boolean) {
        const tableTop = this.margin + 190;
        const tableBottom = this.pageHeight - this.margin - 90;

        const columns = {
            start: this.margin + xOffset,
            beforeQty: this.margin + xOffset + this.slipWidth - 210,
            beforeRate: this.margin + xOffset + this.slipWidth - 140,
            beforeTotal: this.margin + xOffset + this.slipWidth - 70,
            end: this.margin + xOffset + this.slipWidth,
        };

        this.doc
            .fontSize(12)
            .text('Particulars', columns.start + 10, tableTop + 10)
            .text('Qty.', columns.beforeQty + 10, tableTop + 10, {
                width: 40,
                align: 'right',
            })
            .text('Rate', columns.beforeRate + 10, tableTop + 10, {
                width: 40,
                align: 'right',
            })
            .text('Total', columns.beforeTotal + 10, tableTop + 10, {
                width: 40,
                align: 'right',
            });

        this.drawHorizontalLine(tableTop + 30, xOffset);

        Object.values(columns).forEach((x) => {
            this.doc.moveTo(x, tableTop).lineTo(x, tableBottom).stroke();
        });

        if (this.items && this.items.length > 0) {
            let currentY = tableTop + 40;
            const rowHeight = 25;

            this.items.forEach((item) => {
                const itemTotal = item.qty * item.rate;

                const particularsText = item.description
                    ? `${item.particulars} (${item.description})`
                    : item.particulars;

                this.doc
                    .fontSize(10)
                    .text(particularsText, columns.start + 10, currentY)
                    .text(
                        item.qty.toString(),
                        columns.beforeQty + 10,
                        currentY,
                        {
                            width: 40,
                            align: 'right',
                        },
                    )
                    .text(
                        item.rate.toString(),
                        columns.beforeRate + 10,
                        currentY,
                        {
                            width: 40,
                            align: 'right',
                        },
                    )
                    .text(
                        itemTotal.toFixed(2),
                        columns.beforeTotal + 10,
                        currentY,
                        {
                            width: 40,
                            align: 'right',
                        },
                    );

                currentY += rowHeight;
            });
        }

        const totalY = tableBottom - 30;
        this.drawHorizontalLine(totalY, xOffset);

        if (!isLastPage) {
            this.doc
                .fontSize(10)
                .text(
                    'Continued on next page...',
                    columns.start + 10,
                    totalY + 10,
                );
        } else {
            this.doc
                .fontSize(10)
                .text(
                    this.totalQty.toString(),
                    columns.beforeQty + 10,
                    totalY + 10,
                    { width: 40, align: 'right' },
                )
                .text(
                    `₹ ${this.total?.toFixed(2)}`,
                    columns.beforeTotal + 10,
                    totalY + 10,
                    {
                        width: 40,
                        align: 'right',
                    },
                );
        }

        this.drawHorizontalLine(tableBottom, xOffset);

        return this;
    }

    setItems(items: DeliverySlip['items']) {
        this.items = items;
        return this;
    }

    setTotal(total: number) {
        this.total = total;
        return this;
    }

    private drawFooter(
        xOffset: number,
        footer: string,
        note: string,
        isLastPage: boolean,
    ) {
        const footerY = this.pageHeight - this.margin - 80;

        if (isLastPage) {
            this.doc
                .fontSize(10)
                .text(`${footer}`, this.margin + 10 + xOffset, footerY - 25);
        }

        if (isLastPage) {
            const signatureY = footerY + 20;
            this.doc.text(
                'Auth. Sign. .............................',
                this.margin + xOffset + this.slipWidth * 0.6,
                signatureY,
                {
                    width: this.slipWidth * 0.4 - 10,
                    align: 'right',
                },
            );
        }

        if (isLastPage) {
            const signatureY = footerY + 20;
            const noteY = signatureY + 25;
            this.doc
                .fontSize(9)
                .text(`Note: ${note}`, this.margin + 10 + xOffset, noteY, {
                    width: this.slipWidth - 20,
                });
        }

        return this;
    }

    private drawWatermark(xOffset: number, logoPath?: string) {
        if (logoPath) {
            try {
                const centerX = this.margin + xOffset + this.slipWidth / 2;
                const centerY = this.pageHeight / 2;

                this.doc.save();

                this.doc.translate(centerX, centerY).scale(1.5).opacity(0.1);

                this.doc.image(logoPath, -50, -50, {
                    width: 100,
                    height: 100,
                });

                this.doc.restore();
            } catch (error) {
                console.error('Error adding logo watermark:', error);
                const centerX = this.margin + xOffset + this.slipWidth / 2;
                const centerY = this.pageHeight / 2;
                this.doc
                    .save()
                    .translate(centerX, centerY)
                    .scale(1.5)
                    .opacity(0.1)
                    .text('HK', { align: 'center' })
                    .restore();
            }
        } else {
            this.doc
                .save()
                .translate(
                    this.margin + xOffset + this.slipWidth / 2,
                    this.pageHeight / 2,
                )
                .scale(1.5)
                .opacity(0.1)
                .text('HK', { align: 'center' })
                .restore();
        }

        return this;
    }

    private drawHorizontalLine(y: number, xOffset: number) {
        this.doc
            .moveTo(this.margin + xOffset, y)
            .lineTo(this.margin + xOffset + this.slipWidth, y)
            .stroke();
        return this;
    }
}

export const generateDeliverySlip = (
    data: DeliverySlip,
): PDFKit.PDFDocument => {
    const doc = new PDFDocument({
        size: 'A4',
        layout: 'landscape',
        margin: 0,
    });

    const helper = new PDFHelper(doc);
    helper.generateDualSlips(data);

    return doc;
};
