import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import BillingOption from '../../models/billingoptions';

export const createBillingOption = async (
    billingOption: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await BillingOption.create({
            billingOption,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Billing Option created successfully',
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

export const listBillingOptions = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const billingOptions = await BillingOption.find({
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Billing Options retrived successfully',
            data: billingOptions,
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

export const deleteBillingOption = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const deleteBillingOption = await BillingOption.findById(id);

        if (!deleteBillingOption) {
            return {
                statusCode: 404,
                success: false,
                message: 'Billing Options not found',
            };
        }

        if (
            deleteBillingOption.organization &&
            deleteBillingOption.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await BillingOption.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Billing option Deleted successfully',
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
