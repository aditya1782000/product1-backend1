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

interface Item {
    particulars: string;
    qty: number;
    rate: number;
    description?: string;
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
        const ficalYearEnd = new Date(`${endYear}-03-31`);

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
