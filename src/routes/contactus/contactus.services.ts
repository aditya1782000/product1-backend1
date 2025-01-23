import mongoose from 'mongoose';
import ContactUs from '../../models/contactus';
import { AsyncResponseType } from '../../types/async';
import dataTable from '../../utils/dataTable';
import { Request } from 'express';

export const addContactUs = async (
    name: string,
    phoneNumber: number,
    email: string,
    message: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const oContactUS = await ContactUs.create({
            name,
            phoneNumber,
            email,
            message,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Contact us request submitted successfully',
            data: oContactUS,
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

export const listContactUs = async (
    req: Request,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['name', 'email'];

        const oData = dataTable.initDataTable(req.body, searchFields, 'srNo');

        const nRecordsTotal = await ContactUs.countDocuments({
            organization: { $in: organisation },
        });

        const contactUsList = await ContactUs.find({
            $and: [oData.oSearchData],
            organization: { $in: organisation },
        })
            .select('name email phoneNumber message isReolved')
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Contact us requests fetched successfully',
            data: contactUsList,
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

export const deleteContactUs = async (
    contactId: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const oContactUs = await ContactUs.findById({
            _id: contactId,
        }).select('organization');

        if (!oContactUs) {
            return {
                statusCode: 404,
                success: false,
                message: 'Contact us request not found',
            };
        }

        if (
            oContactUs.organization &&
            oContactUs.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const deleteContactUs = await ContactUs.findByIdAndDelete(contactId);

        if (!deleteContactUs) {
            return {
                statusCode: 500,
                success: false,
                message: 'Failed to delete contact us request',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Contact us request deleted successfully',
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

export const resolveContactus = async (
    contactId: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const oContactUs = await ContactUs.findById({
            _id: contactId,
        }).select('organization');

        if (!oContactUs) {
            return {
                statusCode: 404,
                success: false,
                message: 'Contact us request not found',
            };
        }

        if (
            oContactUs.organization &&
            oContactUs.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        oContactUs.isReolved = true;
        await oContactUs.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Contact us request resolved successfully',
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
