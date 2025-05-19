import mongoose from 'mongoose';
import { AsyncResponseType } from '../../types/async';
import NotificationType from '../../models/notificationType';

export const createNotificationType = async (
    notificationType: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        await NotificationType.create({
            notificationType,
            organization: organisation,
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Notification Type created successfully',
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

export const listNotificationType = async (
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const notificationTypes = await NotificationType.find({
            $or: [{ organization: organisation }, { isAll: true }],
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Notification types retrieved successfully',
            data: notificationTypes,
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

export const deleteNotificationType = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const notificationType = await NotificationType.findById(id);

        if (!notificationType) {
            return {
                statusCode: 404,
                success: false,
                message: 'Notification Type not found',
            };
        }

        if (notificationType.notificationType === 'Offer') {
            return {
                statusCode: 403,
                success: false,
                message: 'Offer type can not be deleted',
            };
        }

        if (
            notificationType.organization &&
            notificationType.organization._id.toString() !==
                organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await NotificationType.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: true,
            message: 'Notification Type deleted successfully',
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
