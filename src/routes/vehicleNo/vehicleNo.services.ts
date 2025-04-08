import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import VehicleNo from '../../models/vehicleNo';

export const createVehicleNo = async (
    vehicleNo: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await VehicleNo.create({
            vehicleNo,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Vehicle No. created successfully',
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

export const listVehicleNos = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const vehicleNos = await VehicleNo.find({ organization: organisation });

        return {
            statusCode: 200,
            success: true,
            message: 'Vehicle Nos retrieved successfully',
            data: vehicleNos,
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

export const deleteVehicleNo = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const vehicleNo = await VehicleNo.findById(id);

        if (!vehicleNo) {
            return {
                statusCode: 404,
                success: false,
                message: 'Vehicle No. not found',
            };
        }

        if (
            vehicleNo.organization &&
            vehicleNo.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await VehicleNo.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Vehicle No. deleted successfully',
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
