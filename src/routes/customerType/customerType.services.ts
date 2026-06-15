import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import CustomerType from '../../models/customerType';

export const createCustomerType = async (
    customerType: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await CustomerType.create({
            customerType,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Customer type created successfully',
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

export const listCustomerType = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const customerTypes = await CustomerType.find({
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Customer types retrieved successfully',
            data: customerTypes,
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

export const deleteCustomerType = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const customerType = await CustomerType.findById(id);

        if (!customerType) {
            return {
                statusCode: 404,
                success: false,
                message: 'Customer type not found',
            };
        }

        if (
            customerType.organization &&
            customerType.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await CustomerType.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Customer type deleted successfully',
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
