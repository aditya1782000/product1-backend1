import fs from 'fs';
import { generateDeliverySlip } from './challan';

const testData = {
    gstNo: '24EZNPP4755H',
    mobileNo: 1234567895,
    headingOne: 'HariKrishna',
    headingTwo: 'ENTERPRISE',
    addressLineOne: 'Plot No.440, Gayatri Nagar Society ,',
    addressLineTwo: 'GHB, Sector-27, Gandhinagar.',
    slipNo: 'TEST001',
    date: '19/02/2025',
    name: 'Test Customer',
    address: '123 Test Street, Test City',
    items: [
        {
            particulars: 'Test Item 1',
            qty: 5,
            rate: 100,
        },
        {
            particulars: 'Test Item 2',
            qty: 3,
            rate: 200,
        },
        {
            particulars: 'Test Item 2',
            qty: 3,
            rate: 200,
        },
        {
            particulars: 'Test Item 2',
            qty: 3,
            rate: 200,
        },
        {
            particulars: 'Test Item 2',
            qty: 3,
            rate: 200,
        },
        {
            particulars: 'Test Item 2',
            qty: 3,
            rate: 200,
        },
    ],
    total: 200,
    footer: 'Subject to Gandhinagar Jurisdiction',
    note: 'If there is any issue with the material, please inform us in writing or personally. We will not be responsible afterward.',
    logoPath: '/Users/adi/Downloads/hk.png',
};

const testPDFGeneration = () => {
    const doc = generateDeliverySlip(testData);

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
