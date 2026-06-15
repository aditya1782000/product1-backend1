import mongoose from 'mongoose';
import UnitType from '../../models/unitType';
import { AsyncResponseType } from '../../types/async';

export const createUnitType = async (
    unitType: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await UnitType.create({
            unitType,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Unit type created successfully',
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

export const listUnitTypes = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const unitTypes = await UnitType.find({ organization: organisation });

        return {
            statusCode: 200,
            success: true,
            message: 'Unit types retrieved successfully',
            data: unitTypes,
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

export const deleteUnitType = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const unitType = await UnitType.findById(id);

        if (!unitType) {
            return {
                statusCode: 404,
                success: false,
                message: 'Unit type not found',
            };
        }

        if (
            unitType.organization &&
            unitType.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await UnitType.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Unit type deleted successfully',
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
