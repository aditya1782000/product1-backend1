import PDFDocument from 'pdfkit';

interface DeliveryChallan {
    companyName?: string;
    title?: string;
    companyAddress?: string;
    contactNumber?: number;
    gstNo: string;
    panNo: string;
    partyCode?: string;
    challanNo: string;
    dateNo: string;
    consigneeName: string;
    address: string;
    transportName?: string;
    lrNo?: string;
    truckNo?: string;
    orderNo?: string;
    dated?: string;
    items: {
        srNo: number;
        productName: string;
        packingType: string;
        bagsBoxes: number;
        totalQty: number;
        rate: number;
        amount: number;
    }[];
    workLocation?: string;
    regdOffice?: string;
    cin?: string;
    logoPath?: string;
    footerOne?: string;
    footerTwo?: string;
    footerThree?: string;
    footerFour?: string;
    footerFive?: string;
    total?: string;
}

class ChallanGenerator {
    private doc: PDFKit.PDFDocument;
    private readonly pageWidth = 595;
    private readonly contentWidth = this.pageWidth;

    constructor(doc: PDFKit.PDFDocument) {
        this.doc = doc;
    }

    generateChallan(data: DeliveryChallan) {
        this.drawHeader(data)
            .drawCompanyDetails(data)
            .drawConsigneeDetails(data)
            .drawTransportDetails(data)
            .drawItemsTable(data)
            .drawFooter(data);

        return this;
    }

    private drawHeader(data: DeliveryChallan) {
        const headerTop = 20;

        if (data.logoPath) {
            try {
                this.doc.image(data.logoPath, 30, headerTop, { width: 80 });
            } catch (e) {
                console.error('Error loading logo:', e);
            }
        }

        this.doc
            .fillColor('#555555')
            .fontSize(18)
            .text(data.companyName || '', 0, headerTop, {
                width: this.pageWidth,
                align: 'center',
            })
            .fontSize(14)
            .text(data.title || '', 0, headerTop + 25, {
                width: this.pageWidth,
                align: 'center',
            })
            .fontSize(12)
            .text(data.companyAddress || '', 0, headerTop + 45, {
                width: this.pageWidth,
                align: 'center',
            });

        this.drawHorizontalLine(headerTop + 70);

        return this;
    }

    private drawCompanyDetails(data: DeliveryChallan) {
        const detailsTop = 95;

        this.doc.fillColor('#000000');

        this.doc
            .fontSize(10)
            .text(`GST No : ${data.gstNo}`, 30, detailsTop)
            .text(`PAN No : ${data.panNo}`, 30, detailsTop + 15);

        this.doc
            .fontSize(16)
            .text('DELIVERY CHALLAN', this.pageWidth / 2 - 80, detailsTop, {
                width: 160,
                align: 'center',
            });

        this.doc
            .fontSize(10)
            .text(
                `Challan No.${data.challanNo}`,
                this.pageWidth - 180,
                detailsTop,
            )
            .text(
                `Date No. ${data.dateNo}`,
                this.pageWidth - 180,
                detailsTop + 15,
            );

        this.drawHorizontalLine(detailsTop + 30);

        return this;
    }

    private drawConsigneeDetails(data: DeliveryChallan) {
        const detailsTop = 130;

        this.doc
            .fontSize(10)
            .text(`Consignee's name : ${data.consigneeName}`, 30, detailsTop)
            .text(`Party code no. : ${data.partyCode}`, 30, detailsTop + 15)
            .text(`Mobile no. : +${data.contactNumber}`, 30, detailsTop + 30)
            .text(`Address : ${data.address}`, 30, detailsTop + 45);

        return this;
    }

    private drawTransportDetails(data: DeliveryChallan) {
        const detailsTop = 200;

        this.doc
            .fontSize(10)
            .text(
                `Name of transport : ${data.transportName || ''}`,
                30,
                detailsTop,
            );

        this.doc.text(
            `L.R.No. : ${data.lrNo || ''}`,
            this.pageWidth / 2 - 50,
            detailsTop,
        );

        this.doc.text(
            `Truck no : ${data.truckNo || ''}`,
            this.pageWidth - 180,
            detailsTop,
        );

        this.doc.text(
            `Received from M/s. ${data.companyName} : ${data.title} following material in good`,
            30,
            detailsTop + 25,
            { width: this.contentWidth - 60 },
        );

        this.doc.text(
            `condition. As per our Order No : ${data.orderNo || ''}`,
            30,
            detailsTop + 45,
        );

        this.doc.text(
            `Dated : ${data.dated || ''}`,
            this.pageWidth / 2 + 50,
            detailsTop + 45,
        );

        return this;
    }

    private drawItemsTable(data: DeliveryChallan) {
        const tableTop = 275;
        const tableBottom = 600;
        const tableHeight = tableBottom - tableTop;
        const tableWidth = this.pageWidth - 60;

        const columns = {
            srNo: { x: 30, width: 40 },
            productName: { x: 70, width: 165 },
            packingType: { x: 235, width: 75 },
            bagsBoxes: { x: 310, width: 75 },
            totalQty: { x: 385, width: 65 },
            rate: { x: 450, width: 55 },
            amount: { x: 505, width: 60 },
        };

        this.doc.rect(30, tableTop, tableWidth, tableHeight).stroke();

        this.doc.rect(30, tableTop, tableWidth, 30).stroke();

        this.doc
            .fontSize(10)
            .text('Sr No.', columns.srNo.x, tableTop + 10, {
                width: columns.srNo.width,
                align: 'center',
            })
            .text('Name of Product', columns.productName.x, tableTop + 10, {
                width: columns.productName.width,
                align: 'center',
            })
            .text('Type of Packing', columns.packingType.x, tableTop + 10, {
                width: columns.packingType.width,
                align: 'center',
            })
            .text('No.of Bags & Boxes', columns.bagsBoxes.x, tableTop + 10, {
                width: columns.bagsBoxes.width,
                align: 'center',
            })
            .text('Total Qty (M.T.)', columns.totalQty.x, tableTop + 10, {
                width: columns.totalQty.width,
                align: 'center',
            })
            .text('Rate / M.T', columns.rate.x, tableTop + 10, {
                width: columns.rate.width,
                align: 'center',
            })
            .text('Amount (Rs.)', columns.amount.x, tableTop + 10, {
                width: columns.amount.width,
                align: 'center',
            });

        Object.values(columns).forEach((col) => {
            this.doc
                .moveTo(col.x, tableTop)
                .lineTo(col.x, tableBottom)
                .stroke();
        });

        this.doc
            .moveTo(30 + tableWidth, tableTop)
            .lineTo(30 + tableWidth, tableBottom)
            .stroke();

        let currentY = tableTop + 30;
        const rowHeight = (tableBottom - (tableTop + 30)) / 16;

        for (let i = 1; i <= 16; i++) {
            this.doc
                .moveTo(30, currentY)
                .lineTo(30 + tableWidth, currentY)
                .stroke();

            if (i <= 15) {
                this.doc.text(i.toString(), columns.srNo.x, currentY + 6, {
                    width: columns.srNo.width,
                    align: 'center',
                });
            } else {
                this.doc.text('Total', columns.srNo.x + 5, currentY + 6, {
                    width: columns.productName.width,
                    align: 'left',
                });
            }

            if (i <= data.items.length) {
                const item = data.items[i - 1];
                this.doc
                    .text(
                        item.productName,
                        columns.productName.x + 5,
                        currentY + 6,
                        { width: columns.productName.width - 10 },
                    )
                    .text(
                        item.packingType,
                        columns.packingType.x + 5,
                        currentY + 6,
                        {
                            width: columns.packingType.width - 10,
                            align: 'center',
                        },
                    )
                    .text(
                        item.bagsBoxes.toString(),
                        columns.bagsBoxes.x + 5,
                        currentY + 6,
                        {
                            width: columns.bagsBoxes.width - 10,
                            align: 'center',
                        },
                    )
                    .text(
                        item.totalQty.toString(),
                        columns.totalQty.x + 5,
                        currentY + 6,
                        { width: columns.totalQty.width - 10, align: 'center' },
                    )
                    .text(
                        item.rate.toString(),
                        columns.rate.x + 5,
                        currentY + 6,
                        { width: columns.rate.width - 10, align: 'center' },
                    )
                    .text(
                        item.amount.toString(),
                        columns.amount.x + 5,
                        currentY + 6,
                        { width: columns.amount.width - 10, align: 'right' },
                    );
            }

            if (i === 16 && data.items.length > 0) {
                const totalBags = data.items.reduce(
                    (sum, item) => sum + item.bagsBoxes,
                    0,
                );
                const totalQty = data.items.reduce(
                    (sum, item) => sum + item.totalQty,
                    0,
                );

                this.doc
                    .text(
                        totalBags.toString(),
                        columns.bagsBoxes.x + 5,
                        currentY + 6,
                        {
                            width: columns.bagsBoxes.width - 10,
                            align: 'center',
                        },
                    )
                    .text(
                        totalQty.toString(),
                        columns.totalQty.x + 5,
                        currentY + 6,
                        { width: columns.totalQty.width - 10, align: 'center' },
                    )
                    .text(
                        data.total || '',
                        columns.amount.x + 5,
                        currentY + 6,
                        { width: columns.amount.width - 10, align: 'right' },
                    );
            }

            currentY += rowHeight;
        }

        return this;
    }

    private drawFooter(data: DeliveryChallan) {
        const footerTop = 610;

        this.doc
            .fontSize(10)
            .text(`For. ${data.companyName}`, this.pageWidth - 200, footerTop, {
                width: 180,
                align: 'center',
            });

        this.doc.text(data.title || '', this.pageWidth - 200, footerTop + 15, {
            width: 180,
            align: 'center',
        });

        this.doc
            .fontSize(10)
            .text('Authorised signator', this.pageWidth - 200, footerTop + 60, {
                width: 180,
                align: 'center',
            });

        this.doc.text(data.footerOne || '', 30, footerTop + 75);

        this.doc.fontSize(9).text(data.footerTwo || '', 30, footerTop + 90, {
            width: this.contentWidth - 60,
        });

        this.drawHorizontalLine(footerTop + 120);

        this.doc.fontSize(8);

        let footerAddressY = footerTop + 130;

        this.doc.text(data.footerThree || '', 30, footerAddressY, {
            width: this.contentWidth - 60,
        });
        footerAddressY += 12;

        this.doc.text(data.footerFour || '', 30, footerAddressY, {
            width: this.contentWidth - 60,
        });
        footerAddressY += 12;

        this.doc.text(data.footerFive || '', 30, footerAddressY, {
            width: this.contentWidth - 60,
        });

        return this;
    }

    private drawHorizontalLine(y: number) {
        this.doc.moveTo(0, y).lineTo(this.pageWidth, y).stroke();
        return this;
    }
}

export const generateDeliveryChallan = (
    data: DeliveryChallan,
): PDFKit.PDFDocument => {
    const doc = new PDFDocument({
        size: 'A4',
        layout: 'portrait',
        margin: 0,
        autoFirstPage: true,
        bufferPages: false,
    });

    const generator = new ChallanGenerator(doc);
    generator.generateChallan(data);

    return doc;
};
