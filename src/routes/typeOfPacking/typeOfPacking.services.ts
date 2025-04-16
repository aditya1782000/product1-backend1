import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import TypeOfPacking from '../../models/typeOfPacking';

export const createTypeOfPacking = async (
    typeOfPacking: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await TypeOfPacking.create({
            typeOfPacking,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Type of Packing created successfully',
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

export const listTypeOfPacking = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const typeofPackings = await TypeOfPacking.find({
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Type of Packings retrieved successfully',
            data: typeofPackings,
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

export const deleteTypeOfPacking = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const typeOfPacking = await TypeOfPacking.findById(id);

        if (!typeOfPacking) {
            return {
                statusCode: 404,
                success: false,
                message: 'Type of Packing not found',
            };
        }

        if (
            typeOfPacking.organization &&
            typeOfPacking.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await TypeOfPacking.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Type of Packing deleted successfully',
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
