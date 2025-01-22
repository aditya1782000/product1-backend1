import ContactUs from '../../models/contactus';
import { AsyncResponseType } from '../../types/async';

export const addContactUs = async (
    name: string,
    phoneNumber: number,
    email: string,
    message: string,
): Promise<AsyncResponseType> => {
    try {
        const oContactUS = await ContactUs.create({
            name,
            phoneNumber,
            email,
            message,
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
