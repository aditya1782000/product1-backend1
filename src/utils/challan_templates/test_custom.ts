import fs from 'fs';
import { generateDeliveryChallan } from './challan2';

const challanData = {
    companyName: 'Ultratech Cement Ltd.',
    divisionName: 'Building Products Division',
    companyAddress: 'Near KH 2, Mahatama mandir Road, Gandhinagar',
    gstNo: '24AAAACL6442L1ZG',
    partyCode: '123456',
    contactNumber: +912354789652,
    panNo: 'AAACL6442L',
    challanNo: 'UCL/2023/0001',
    dateNo: '01/04/2023',
    consigneeName: 'ABC Construction Company',
    address: '123 Main Street, Ahmedabad',
    transportName: 'XYZ Transport',
    lrNo: 'LR12345',
    truckNo: 'GJ01XX1234',
    orderNo: 'PO-5678',
    dated: '31/03/2023',
    items: [
        {
            srNo: 1,
            productName: 'Portland Cement',
            packingType: 'Bags',
            bagsBoxes: 100,
            totalQty: 5,
            rate: 350,
            amount: 1750,
        },
        {
            srNo: 2,
            productName: 'White Cement',
            packingType: 'Bags',
            bagsBoxes: 50,
            totalQty: 2.5,
            rate: 500,
            amount: 1250,
        },
    ],
    workLocation:
        'Work : plot no.61/1 94/1 & 6, Bhiwandi Wada road, chikhale & vilpapur, Wada Thane ( Maharashtra) - 421 303',
    regdOffice:
        'Regd. Office: B-wing Ahura center 2nd Floor Mahakali caves road andheri ( East) Mumbai-400 093 Tel: 022-669178',
    cin: 'L26940MH2000PLC128420',
};

const testPDFGeneration = () => {
    const doc = generateDeliveryChallan(challanData);

    const writeStream = fs.createWriteStream('./test-delivery-slip.pdf');

    doc.pipe(writeStream);

    // Handle completion
    // writeStream.on('finish', () => {
    //     console.log('PDF has been generated successfully!');
    //     console.log('File saved as: test-delivery-slip.pdf');
    // });

    writeStream.on('error', (error) => {
        console.error('Error generating PDF:', error);
    });

    doc.end();
};

// Run the test
testPDFGeneration();
