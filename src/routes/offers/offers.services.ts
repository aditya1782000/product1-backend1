import mongoose from 'mongoose';
import Notification from '../../models/notifications';
import { AsyncResponseType } from '../../types/async';

export const offerBanner = async (
    organisation: mongoose.Types.ObjectId,
    role: string,
): Promise<AsyncResponseType> => {
    try {
        let offerBanners;

        if (role === 'superAdmin' || role === 'subAdmin') {
            offerBanners = await Notification.find({
                type: 'Offer',
                organization: { $in: organisation },
            });
        } else if (role === 'customer') {
            offerBanners = await Notification.find({
                type: 'Offer',
                organization: { $in: organisation },
                isActive: true,
            });
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Offer banners have been retrived successfully',
            data: offerBanners,
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

export const toggleOfferBannerStatus = async (
    id: string,
    status: boolean,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const offerBanner = await Notification.findById(id);

        if (!offerBanner || offerBanner.type !== 'Offer') {
            return {
                statusCode: 404,
                success: false,
                message: 'Offer banner not found',
            };
        }
        if (
            offerBanner.organization &&
            offerBanner.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        if (status === true) {
            await Notification.findByIdAndUpdate(id, { isActive: true });
        } else if (status === false) {
            await Notification.findByIdAndUpdate(id, { isActive: false });
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Offer banner status has been changed',
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

export const deleteOfferBanner = async (
    id: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const offerBanner = await Notification.findById(id);

        if (!offerBanner || offerBanner.type !== 'Offer') {
            return {
                statusCode: 404,
                success: false,
                message: 'Offer banner not found',
            };
        }

        if (
            offerBanner.organization &&
            offerBanner.organization._id.toString() !== organisation.toString()
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        await Notification.findByIdAndDelete(id);

        return {
            statusCode: 200,
            success: false,
            message: 'Offer banner has been deleted successfully',
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
