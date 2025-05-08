import GstPercentage from '../../models/gstPercentage';
import { AsyncResponseType } from '../../types/async';

export const createGstPercentage = async (
    gstPercentage: number,
): Promise<AsyncResponseType> => {
    try {
        await GstPercentage.create({
            gstPercentage,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Gst Percentage created successfully',
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

export const listGstPercentage = async (): Promise<AsyncResponseType> => {
    try {
        const gstPercentage = await GstPercentage.find();

        return {
            statusCode: 200,
            success: true,
            message: 'Gst Percentage retrivees successfully',
            data: gstPercentage,
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
