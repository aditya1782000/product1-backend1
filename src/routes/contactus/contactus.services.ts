import mongoose from 'mongoose';
import ContactUs from '../../models/contactus';
import { AsyncResponseType } from '../../types/async';

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
