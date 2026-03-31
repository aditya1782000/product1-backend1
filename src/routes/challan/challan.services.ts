import { Request } from 'express';
import { AsyncResponseType } from '../../types/async';
import mongoose from 'mongoose';
import {
    deleteFileFromS3,
    extractS3Key,
    uploadFileBufferToS3,
    uploadFileToS3,
} from '../../utils/aws';
import ChallanOrganization from '../../models/challanOrganization';
import Organisation from '../../models/organisation';
import Challan from '../../models/challan';
import { generateDeliverySlip } from '../../utils/challan_templates/challan';
import { convertImageUrlToBase64 } from '../../utils/imageConverter';
import formatDate from '../../utils/date';
import dataTable from '../../utils/dataTable';
import fs from 'fs';
import CustomChallanOrg from '../../models/customChallanOrg';
import { generateDeliveryChallan } from '../../utils/challan_templates/challan2';
import CustomChallan from '../../models/customChallan';

interface Item {
    particulars: string;
    qty: number;
    rate: number;
    description?: string;
}

interface CustomItem {
    productName: string;
    typeOfPacking?: string;
    bagBoxes?: number;
    qty: number;
    rate: number;
}

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

export const createChallanOrganization = async (
    req: Request,
    mobileNo: number,
    organisation: mongoose.Types.ObjectId,
    footer?: string,
    note?: string,
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const existingChallanOrganisation = await ChallanOrganization.findOne({
            organization: organisation,
        });

        if (existingChallanOrganisation) {
            return {
                statusCode: 409,
                success: false,
                message: 'Challan organization already exists',
            };
        }

        const organizationDetails = await Organisation.findById({
            _id: organisation,
        });

        let logoImageUrl: string | undefined;

        if (req.file) {
            tempFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'challanOrganization',
            );
            logoImageUrl = uploadData.Location;
        }

        const organisationNameParts =
            organizationDetails?.organisationName.split(' ');
        const headingOne = organisationNameParts?.[0] || '';
        const headingTwo = organisationNameParts?.slice(1).join(' ') || '';

        const oChallanOrganization = await ChallanOrganization.create({
            gstNo: organizationDetails?.gstNumber,
            mobileNo: Number(mobileNo),
            headingOne: headingOne,
            headingTwo: headingTwo,
            addressLineOne: organizationDetails?.addressLineone,
            addressLineTwo: organizationDetails?.addressLineTwo,
            logoPath: logoImageUrl,
            footer,
            note,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Challan has been added for this organization',
            data: oChallanOrganization,
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
        if (tempFilePath) {
            deleteTempFile(tempFilePath);
        }
    }
};

export const createChallan = async (
    customerName: string,
    customerMobileNo: string,
    date: Date,
    address: string,
    items: Item[],
    total: number,
    organisation: mongoose.Types.ObjectId,
    vehicleNo?: string,
    fraightAndTransport?: number,
): Promise<AsyncResponseType> => {
    try {
        const existingChallanOrganisation = await ChallanOrganization.findOne({
            organization: organisation,
        });

        if (!existingChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Challan does not exist for this organization please create one.',
            };
        }

        let processedLogoPath = existingChallanOrganisation.logoPath;
        if (processedLogoPath) {
            try {
                processedLogoPath =
                    await convertImageUrlToBase64(processedLogoPath);
            } catch (error) {
                throw error;
            }
        }

        const currentDate = new Date();
        let startYear: number;
        let endYear: number;

        if (currentDate.getMonth() >= 3) {
            startYear = currentDate.getFullYear();
            endYear = currentDate.getFullYear() + 1;
        } else {
            startYear = currentDate.getFullYear() - 1;
            endYear = currentDate.getFullYear();
        }

        const ficalYearStart = new Date(`${startYear}-04-01`);
        const ficalYearEnd = new Date(`${endYear}-04-01`);

        const nChallanTotal = await Challan.countDocuments({
            challanOrg: organisation,
            dCreatedAt: { $gte: ficalYearStart, $lt: ficalYearEnd },
        });

        const ChallanNo = `${nChallanTotal + 1}`;

        let formattedDate: string;
        if (typeof date === 'string') {
            formattedDate = date;
        } else {
            formattedDate = date.toISOString().split('T')[0];
        }

        const challanFile = generateDeliverySlip({
            gstNo: existingChallanOrganisation.gstNo,
            mobileNo: existingChallanOrganisation.mobileNo,
            headingOne: existingChallanOrganisation.headingOne,
            headingTwo: existingChallanOrganisation.headingTwo,
            addressLineOne: existingChallanOrganisation.addressLineOne,
            addressLineTwo: existingChallanOrganisation.addressLineTwo,
            logoPath: processedLogoPath,
            footer: existingChallanOrganisation.footer,
            note: existingChallanOrganisation.note,
            total,
            slipNo: ChallanNo,
            date: formatDate(formattedDate),
            name: customerName,
            address,
            items,
            customerMobileNo: Number(customerMobileNo),
            vehicleNo: vehicleNo,
            fraightAndTransport: Number(fraightAndTransport),
        });

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Uint8Array[] = [];

            challanFile.on('data', (chunk) => chunks.push(chunk));
            challanFile.on('end', () => resolve(Buffer.concat(chunks)));
            challanFile.on('error', reject);

            challanFile.end();
        });

        const uploadData = await uploadFileBufferToS3(
            pdfBuffer,
            `${Date.now().toString()}`,
            'challans',
            'application/pdf',
        );

        const oChallan = await Challan.create({
            challanOrg: existingChallanOrganisation.organization,
            challanNo: ChallanNo,
            customerName,
            date: formattedDate,
            address,
            items,
            total,
            challanUrl: uploadData.Location,
            vehicleNo: vehicleNo,
            customerMobileNo: customerMobileNo,
            fraightAndTransport: fraightAndTransport,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Challan has been created',
            data: oChallan,
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

export const viewChallanOrganization = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const existingChallanOrganisation = await ChallanOrganization.findOne({
            organization: organisation,
        });

        if (!existingChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Challan does not exist for this organization please create one.',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Challan organization details',
            data: existingChallanOrganisation,
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

export const editChallanOrganization = async (
    req: Request,
    challanOrgId: string,
    organisation: mongoose.Types.ObjectId,
    mobileNo?: number,
    footer?: string,
    note?: string,
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const existingChallanOrganisation =
            await ChallanOrganization.findById(challanOrgId);

        if (!existingChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Challan does not exist for this organization please create one.',
            };
        }

        if (
            existingChallanOrganisation.organization &&
            existingChallanOrganisation.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        let logoImageUrl: string | undefined;

        if (req.file) {
            if (existingChallanOrganisation.logoPath) {
                const key = extractS3Key(existingChallanOrganisation.logoPath);
                deleteFileFromS3(key);
            }
            tempFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'challanOrganization',
            );
            logoImageUrl = uploadData.Location;
        }

        await ChallanOrganization.findByIdAndUpdate(
            existingChallanOrganisation._id,
            {
                gstNo: existingChallanOrganisation?.gstNo,
                mobileNo: Number(mobileNo),
                headingOne: existingChallanOrganisation?.headingOne,
                headingTwo: existingChallanOrganisation?.headingTwo,
                addressLineOne: existingChallanOrganisation?.addressLineOne,
                addressLineTwo: existingChallanOrganisation?.addressLineTwo,
                logoPath: logoImageUrl || existingChallanOrganisation?.logoPath,
                footer: footer || existingChallanOrganisation?.footer,
                note: note || existingChallanOrganisation?.note,
                organization: organisation,
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Challan organization updated successfully',
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
        if (tempFilePath) {
            deleteTempFile(tempFilePath);
        }
    }
};

export const deleteChallanOrganization = async (
    challanOrgId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const existingChallanOrganisation =
            await ChallanOrganization.findById(challanOrgId);

        if (!existingChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Challan does not exist for this organization please create one.',
            };
        }

        if (
            existingChallanOrganisation.organization &&
            existingChallanOrganisation.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        if (existingChallanOrganisation.logoPath) {
            const key = extractS3Key(existingChallanOrganisation.logoPath);
            deleteFileFromS3(key);
        }

        await ChallanOrganization.findByIdAndDelete(challanOrgId);

        return {
            statusCode: 200,
            success: true,
            message: 'Challan organization deleted successfully',
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

export const viewChallan = async (
    challanId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oChallan = await Challan.findById(challanId);

        if (!oChallan) {
            return {
                statusCode: 404,
                success: false,
                message: 'Challan not found',
            };
        }

        if (
            oChallan.challanOrg &&
            oChallan.challanOrg._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Challan details',
            data: oChallan,
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

export const editChallan = async (
    challanId: string,
    organisation: mongoose.Types.ObjectId,
    customerName?: string,
    customerMobileNo?: string,
    date?: Date,
    address?: string,
    items?: Item[],
    total?: number,
    vehicleNo?: string,
    fraightAndTransport?: number,
): Promise<AsyncResponseType> => {
    try {
        const oChallan = await Challan.findById(challanId);

        if (!oChallan) {
            return {
                statusCode: 404,
                success: false,
                message: 'Challan not found',
            };
        }

        if (
            oChallan.challanOrg &&
            oChallan.challanOrg._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const existingChallanOrganisation = await ChallanOrganization.findOne({
            organization: organisation,
        });

        if (!existingChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Challan does not exist for this organization please create one.',
            };
        }

        let processedLogoPath = existingChallanOrganisation.logoPath;
        if (processedLogoPath) {
            try {
                processedLogoPath =
                    await convertImageUrlToBase64(processedLogoPath);
            } catch (error) {
                throw error;
            }
        }

        let formattedDate: string;
        if (typeof date === 'string') {
            formattedDate = date;
        } else {
            formattedDate = date?.toISOString().split('T')[0] || '';
        }

        const challanFile = generateDeliverySlip({
            gstNo: existingChallanOrganisation.gstNo,
            mobileNo: existingChallanOrganisation.mobileNo,
            headingOne: existingChallanOrganisation.headingOne,
            headingTwo: existingChallanOrganisation.headingTwo,
            addressLineOne: existingChallanOrganisation.addressLineOne,
            addressLineTwo: existingChallanOrganisation.addressLineTwo,
            logoPath: processedLogoPath,
            footer: existingChallanOrganisation.footer,
            note: existingChallanOrganisation.note,
            total: total || oChallan.total || 0,
            slipNo: oChallan.challanNo,
            date: formatDate(formattedDate),
            name: customerName || oChallan.customerName || '',
            customerMobileNo:
                Number(customerMobileNo) || oChallan.customerMobileNo,
            address: address || oChallan.address || '',
            items: items || oChallan.items || [],
            vehicleNo: vehicleNo || oChallan.vehicleNo || '',
            fraightAndTransport:
                Number(fraightAndTransport) ||
                Number(oChallan.fraightAndTransport),
        });

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Uint8Array[] = [];

            challanFile.on('data', (chunk) => chunks.push(chunk));
            challanFile.on('end', () => resolve(Buffer.concat(chunks)));
            challanFile.on('error', reject);

            challanFile.end();
        });
        if (oChallan.challanUrl) {
            const key = extractS3Key(oChallan.challanUrl);
            deleteFileFromS3(key);
        }
        const uploadData = await uploadFileBufferToS3(
            pdfBuffer,
            `${Date.now().toString()}`,
            'challans',
            'application/pdf',
        );

        await Challan.findByIdAndUpdate(challanId, {
            challanOrg: existingChallanOrganisation.organization,
            challanNo: oChallan.challanNo,
            customerName: customerName || oChallan.customerName,
            date: formattedDate || oChallan.date,
            address: address || oChallan.address,
            items: items || oChallan.items,
            total: total || oChallan.total,
            challanUrl: uploadData.Location,
            customerMobileNo: customerMobileNo || oChallan.customerMobileNo,
            vehicleNo: vehicleNo || oChallan.vehicleNo,
            fraightAndTransport: fraightAndTransport,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Challan updated successfully',
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

export const deleteChallan = async (
    challanId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oChallan = await Challan.findById(challanId);

        if (!oChallan) {
            return {
                statusCode: 404,
                success: false,
                message: 'Challan not found',
            };
        }

        if (
            oChallan.challanOrg &&
            oChallan.challanOrg._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await Challan.findByIdAndDelete(challanId);

        if (oChallan.challanUrl) {
            const key = extractS3Key(oChallan.challanUrl);
            deleteFileFromS3(key);
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Challan deleted successfully',
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

export const listChallans = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['customerName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const nRecordsTotal = await Challan.countDocuments({
            challanOrg: { $in: organisation },
        });

        const challanList = await Challan.find({
            $and: [oData.oSearchData],
            challanOrg: { $in: organisation },
        })
            .select('challanNo customerName total challanUrl date')
            .collation({ locale: 'en', strength: 1 })
            .sort({ dCreatedAt: -1 })
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Challan list fetched successfully',
            data: challanList,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
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

export const listChallanOrgnaization = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['headingOne', 'headingTwo'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'id');

        const nRecordsTotal = await ChallanOrganization.countDocuments({
            organization: organisation,
        });

        const challanOrgList = await ChallanOrganization.find({
            $and: [oData.oSearchData],
            organization: organisation,
        })
            .select(
                'id headingOne headingTwo addressLineOne addressLineTwo mobileNo logoPath footer note',
            )
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Challan organization list fetched successfully',
            data: challanOrgList,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
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

export const createCustomChallanOrganization = async (
    challanOrg: string,
    title: string,
    address: string,
    gstNo: string,
    panNo: string,
    headerContent: string,
    organisation: mongoose.Types.ObjectId,
    footerOne?: string,
    footerTwo?: string,
    footerThree?: string,
    footerFour?: string,
    footerFive?: string,
): Promise<AsyncResponseType> => {
    try {
        const existingCustomChallanOrganisation =
            await CustomChallanOrg.findOne({
                organization: organisation,
            });

        if (existingCustomChallanOrganisation) {
            return {
                statusCode: 409,
                success: false,
                message: 'Custom Challan for this organization aleady exists',
            };
        }

        const oCustomChallanOrg = await CustomChallanOrg.create({
            challanOrg,
            title,
            address,
            gstNo,
            panNo,
            headerContent,
            footerOne,
            footerTwo,
            footerThree,
            footerFour,
            footerFive,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Custom Challan has been added fro this organization',
            data: oCustomChallanOrg,
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

export const createCustomChallan = async (
    customerName: string,
    customerMobileNo: number,
    date: Date,
    address: string,
    dated: Date,
    items: CustomItem[],
    total: number,
    organisation: mongoose.Types.ObjectId,
    partyCode?: string,
    nameOfTransport?: string,
    lrNo?: string,
    orderNo?: string,
    vehicleNo?: string,
): Promise<AsyncResponseType> => {
    try {
        const existingCustomChallanOrganisation =
            await CustomChallanOrg.findOne({
                organization: organisation,
            });

        if (!existingCustomChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Custom Challan does not exist for this organization please create one.',
            };
        }

        const currentDate = new Date();
        let startYear: number;
        let endYear: number;

        if (currentDate.getMonth() >= 3) {
            startYear = currentDate.getFullYear();
            endYear = currentDate.getFullYear() + 1;
        } else {
            startYear = currentDate.getFullYear() - 1;
            endYear = currentDate.getFullYear();
        }

        const ficalYearStart = new Date(`${startYear}-04-01`);
        const ficalYearEnd = new Date(`${endYear}-04-01`);

        const nChallanTotal = await CustomChallan.countDocuments({
            customChallanOrg: organisation,
            dCreatedAt: { $gte: ficalYearStart, $lt: ficalYearEnd },
        });

        const ChallanNo = `${nChallanTotal + 1}`;

        let formattedDate: string;
        if (typeof date === 'string') {
            formattedDate = date;
        } else {
            formattedDate = date.toISOString().split('T')[0];
        }

        let formattedDated: string;
        if (typeof dated === 'string') {
            formattedDated = dated;
        } else {
            formattedDated = dated.toISOString().split('T')[0];
        }

        const formattedItems = items.map((item, index) => ({
            srNo: index + 1,
            productName: item.productName,
            packingType: item.typeOfPacking || '',
            bagsBoxes: item.bagBoxes || 0,
            totalQty: item.qty,
            rate: item.rate,
            amount: item.qty * item.rate,
        }));

        const customChallanFile = generateDeliveryChallan({
            companyName: existingCustomChallanOrganisation.challanOrg,
            title: existingCustomChallanOrganisation.title,
            companyAddress: existingCustomChallanOrganisation.address,
            contactNumber: customerMobileNo,
            gstNo: existingCustomChallanOrganisation.gstNo,
            panNo: existingCustomChallanOrganisation.panNo,
            partyCode: partyCode,
            challanNo: ChallanNo,
            dateNo: formatDate(formattedDate),
            consigneeName: customerName,
            address: address,
            transportName: nameOfTransport,
            lrNo: lrNo,
            truckNo: vehicleNo,
            orderNo: orderNo,
            dated: formatDate(formattedDated),
            items: formattedItems,
            footerOne: existingCustomChallanOrganisation.footerOne,
            footerTwo: existingCustomChallanOrganisation.footerTwo,
            footerThree: existingCustomChallanOrganisation.footerThree,
            footerFour: existingCustomChallanOrganisation.footerFour,
            footerFive: existingCustomChallanOrganisation.footerFive,
            total: String(total),
        });

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Uint8Array[] = [];

            customChallanFile.on('data', (chunk) => chunks.push(chunk));
            customChallanFile.on('end', () => resolve(Buffer.concat(chunks)));
            customChallanFile.on('error', reject);

            customChallanFile.end();
        });

        const uploadData = await uploadFileBufferToS3(
            pdfBuffer,
            `${Date.now().toString()}`,
            'customChallans',
            'application/pdf',
        );

        const oCustomChallan = await CustomChallan.create({
            customChallanOrg: existingCustomChallanOrganisation.organization,
            challanNo: ChallanNo,
            customerName,
            customerMobileNo,
            date: formattedDate,
            dated: formattedDated,
            address,
            partyCode,
            nameOfTransport,
            orderNo,
            lrNo,
            items,
            vehicleNo,
            total,
            challanUrl: uploadData.Location,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Challan has been created',
            data: oCustomChallan,
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

export const viewCustomChallanOrganization = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const existingCustomChallanOrganisation =
            await CustomChallanOrg.findOne({
                organization: organisation,
            });

        if (!existingCustomChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Custom Challan does not exist for this organization please create one.',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Custom Challan details',
            data: existingCustomChallanOrganisation,
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

export const editCustomChallanOrganization = async (
    challanOrgId: string,
    organisation: mongoose.Types.ObjectId,
    challanOrg: string,
    title: string,
    address: string,
    gstNo: string,
    panNo: string,
    headerContent: string,
    footerOne?: string,
    footerTwo?: string,
    footerThree?: string,
    footerFour?: string,
    footerFive?: string,
): Promise<AsyncResponseType> => {
    try {
        const existingCustomChallanOrganisation =
            await CustomChallanOrg.findById(challanOrgId);

        if (!existingCustomChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Custom Challan does not exist for this organization please create one.',
            };
        }

        if (
            existingCustomChallanOrganisation.organization &&
            existingCustomChallanOrganisation.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const oCustomChallan = await CustomChallanOrg.findByIdAndUpdate(
            existingCustomChallanOrganisation._id,
            {
                challanOrg:
                    challanOrg || existingCustomChallanOrganisation.challanOrg,
                title: title || existingCustomChallanOrganisation.title,
                address: address || existingCustomChallanOrganisation.address,
                gstNo: gstNo || existingCustomChallanOrganisation.gstNo,
                panNo: panNo || existingCustomChallanOrganisation.panNo,
                headerContent:
                    headerContent ||
                    existingCustomChallanOrganisation.headerContent,
                footerOne:
                    footerOne || existingCustomChallanOrganisation.footerOne,
                footerTwo:
                    footerTwo || existingCustomChallanOrganisation.footerTwo,
                footerThree:
                    footerThree ||
                    existingCustomChallanOrganisation.footerThree,
                footerFour:
                    footerFour || existingCustomChallanOrganisation.footerFour,
                footerFive:
                    footerFive || existingCustomChallanOrganisation.footerFive,
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Custom Challan organization updated successfully',
            data: oCustomChallan,
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

export const deleteCustomChallanOrgnization = async (
    challanOrgId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const existingCustomChallanOrganisation =
            await CustomChallanOrg.findById(challanOrgId);

        if (!existingCustomChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Custom Challan does not exist for this organization please create one.',
            };
        }

        if (
            existingCustomChallanOrganisation.organization &&
            existingCustomChallanOrganisation.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await CustomChallanOrg.findByIdAndDelete(challanOrgId);

        return {
            statusCode: 200,
            success: true,
            message: 'Custom challan Organziation deleted successfully',
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

export const viewCustomChallan = async (
    challanId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oChallan = await CustomChallan.findById(challanId);

        if (!oChallan) {
            return {
                statusCode: 404,
                success: false,
                message: 'Challan not found',
            };
        }

        if (
            oChallan.customChallanOrg &&
            oChallan.customChallanOrg._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Challan details',
            data: oChallan,
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

export const editCustomChallan = async (
    challanId: string,
    customerName: string,
    customerMobileNo: number,
    date: Date,
    address: string,
    dated: Date,
    items: CustomItem[],
    total: number,
    organisation: mongoose.Types.ObjectId,
    partyCode?: string,
    nameOfTransport?: string,
    lrNo?: string,
    orderNo?: string,
    vehicleNo?: string,
): Promise<AsyncResponseType> => {
    try {
        const oChallan = await CustomChallan.findById(challanId);

        if (!oChallan) {
            return {
                statusCode: 404,
                success: false,
                message: 'Challan not found',
            };
        }

        if (
            oChallan.customChallanOrg &&
            oChallan.customChallanOrg._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const existingCustomChallanOrganisation =
            await CustomChallanOrg.findOne({
                organization: organisation,
            });

        if (!existingCustomChallanOrganisation) {
            return {
                statusCode: 404,
                success: false,
                message:
                    'Custom Challan does not exist for this organization please create one.',
            };
        }

        let formattedDate: string;
        if (typeof date === 'string') {
            formattedDate = date;
        } else {
            formattedDate = date.toISOString().split('T')[0];
        }

        let formattedDated: string;
        if (typeof dated === 'string') {
            formattedDated = dated;
        } else {
            formattedDated = dated.toISOString().split('T')[0];
        }

        const formattedItems = items.map((item, index) => ({
            srNo: index + 1,
            productName: item.productName,
            packingType: item.typeOfPacking || '',
            bagsBoxes: item.bagBoxes || 0,
            totalQty: item.qty,
            rate: item.rate,
            amount: item.qty * item.rate,
        }));

        const customChallanFile = generateDeliveryChallan({
            companyName: existingCustomChallanOrganisation.challanOrg,
            title: existingCustomChallanOrganisation.title,
            companyAddress: existingCustomChallanOrganisation.address,
            contactNumber: customerMobileNo || oChallan.customerMobileNo,
            gstNo: existingCustomChallanOrganisation.gstNo,
            panNo: existingCustomChallanOrganisation.panNo,
            partyCode: partyCode || oChallan.partyCode,
            challanNo: oChallan.challanNo,
            dateNo: formatDate(formattedDate),
            consigneeName: customerName || oChallan.customerName,
            address: address || oChallan.address,
            transportName: nameOfTransport || oChallan.nameOfTransport,
            lrNo: lrNo || oChallan.lrNo,
            truckNo: vehicleNo || oChallan.vehicleNo,
            orderNo: orderNo || oChallan.orderNo,
            dated: formatDate(formattedDated),
            items: formattedItems || oChallan.items,
            footerOne: existingCustomChallanOrganisation.footerOne,
            footerTwo: existingCustomChallanOrganisation.footerTwo,
            footerThree: existingCustomChallanOrganisation.footerThree,
            footerFour: existingCustomChallanOrganisation.footerFour,
            footerFive: existingCustomChallanOrganisation.footerFive,
            total: String(total) || String(oChallan.total),
        });

        const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: Uint8Array[] = [];

            customChallanFile.on('data', (chunk) => chunks.push(chunk));
            customChallanFile.on('end', () => resolve(Buffer.concat(chunks)));
            customChallanFile.on('error', reject);

            customChallanFile.end();
        });

        if (oChallan.challanUrl) {
            const key = extractS3Key(oChallan.challanUrl);
            deleteFileFromS3(key);
        }

        const uploadData = await uploadFileBufferToS3(
            pdfBuffer,
            `${Date.now().toString()}`,
            'customChallans',
            'application/pdf',
        );

        const oCusomChallan = await CustomChallan.findByIdAndUpdate(challanId, {
            customChallanOrg: existingCustomChallanOrganisation.organization,
            challanNo: oChallan.challanNo,
            customerName: customerName || oChallan.customerName,
            customerMobileNo: customerMobileNo || oChallan.customerMobileNo,
            date: formattedDate,
            dated: formattedDated,
            address: address || oChallan.address,
            partyCode: partyCode || oChallan.partyCode,
            nameOfTransport: nameOfTransport || oChallan.nameOfTransport,
            orderNo: orderNo || oChallan.orderNo,
            lrNo: lrNo || oChallan.lrNo,
            items: items || oChallan.items,
            vehicleNo: vehicleNo || oChallan.vehicleNo,
            total: total || oChallan.total,
            challanUrl: uploadData.Location,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Challan updated successfully',
            data: oCusomChallan,
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

export const deleteCustomChallan = async (
    challanId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oChallan = await CustomChallan.findById(challanId);

        if (!oChallan) {
            return {
                statusCode: 404,
                success: false,
                message: 'Challan not found',
            };
        }

        if (
            oChallan.customChallanOrg &&
            oChallan.customChallanOrg._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await CustomChallan.findByIdAndDelete(challanId);

        if (oChallan.challanUrl) {
            const key = extractS3Key(oChallan.challanUrl);
            deleteFileFromS3(key);
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Challan deleted successfully',
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

export const listCustomChallanOrg = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['challanOrg'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'id');

        const nRecordsTotal = await CustomChallanOrg.countDocuments({
            organization: organisation,
        });

        const customChallanOrgList = await CustomChallanOrg.find({
            $and: [oData.oSearchData],
            organization: organisation,
        })
            .select(
                '_id challanOrg title address gstNo panNo headerContent footerOne footerTwo footerThree footerFour footerFive',
            )
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Challan organization list fetched successfully',
            data: customChallanOrgList,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
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

export const listCustomChallan = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['customerName'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const nRecordsTotal = await CustomChallan.countDocuments({
            customChallanOrg: { $in: organisation },
        });

        const challanList = await CustomChallan.find({
            $and: [oData.oSearchData],
            customChallanOrg: { $in: organisation },
        })
            .select('challanNo customerName total challanUrl date')
            .collation({ locale: 'en', strength: 1 })
            .sort({ dCreatedAt: -1 })
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Challan list fetched successfully',
            data: challanList,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: nRecordsTotal,
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
