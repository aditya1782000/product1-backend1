import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import DeliveryAddress from '../../models/deliveryAddress';

export const addDeliveryAddress = async (
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
    customer: mongoose.Types.ObjectId,
    organization: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const deliveryAddress = await DeliveryAddress.create({
            addressLineOne,
            addressLineTwo,
            city,
            state,
            pinCode,
            customer,
            organization,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Delivery address added successfully',
            data: deliveryAddress,
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

export const listDeliveryAddress = async (
    customer: mongoose.Types.ObjectId,
    organization: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const deliveryAddresses = await DeliveryAddress.find({
            customer,
            organization,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Delivery addresses retrieved successfully',
            data: deliveryAddresses,
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
