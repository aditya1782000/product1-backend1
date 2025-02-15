import { AsyncResponseType } from '../../types/async';
import { getMessaging } from 'firebase-admin/messaging';
import '../../utils/firebase';
import mongoose from 'mongoose';
import User from '../../models/user';
import Notification from '../../models/notifications';
import { uploadFileToS3 } from '../../utils/aws';
import { Request } from 'express';
import fs from 'fs';

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

export const sendNotifications = async (
    req: Request,
    customers: mongoose.Types.ObjectId[],
    title: string,
    body: string,
    type: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const messaging = getMessaging();

        const users = await User.find({
            _id: { $in: customers },
            organization: { $in: organisation },
            fcmToken: { $exists: true, $ne: null },
        }).populate('organization', '_id');

        if (!users || users.length === 0) {
            return {
                statusCode: 404,
                success: false,
                message: 'No customers found or FCM token not found',
            };
        }
        let imageUrl: string | undefined;

        if (req.file) {
            tempFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'order',
            );
            imageUrl = uploadData.Location;
        }

        const fcmTokens: string[] = users
            .map((user) => user.fcmToken)
            .filter((token): token is string => !!token);

        if (!fcmTokens.length) {
            return {
                statusCode: 404,
                success: false,
                message: 'No valid FCM tokens found',
            };
        }

        await Promise.all(
            fcmTokens.map((token) =>
                messaging.send({
                    notification: {
                        title,
                        body,
                        imageUrl,
                    },
                    token,
                }),
            ),
        );

        const notifications = users.map((user) => ({
            title,
            description: body,
            imageurl: imageUrl,
            isRead: false,
            organization: organisation,
            user: user._id,
            type,
        }));

        await Notification.insertMany(notifications);

        return {
            statusCode: 200,
            success: true,
            message: 'Notification sent successfully',
            data: {
                totalSent: notifications.length,
                totalUsers: users.length,
            },
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
    } finally {
        if (tempFilePath) {
            deleteTempFile(tempFilePath);
        }
    }
};

export const customerNotificationList = async (
    customerId: string,
    start: number,
    limit: number,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const notifications = await Notification.find({
            user: customerId,
            organization: { $in: organisation },
            isRead: false,
        })
            .populate('user', '_id firstName lastName phoneNumber')
            .select('title description imageurl type isRead dCreatedAt')
            .sort({ dCreatedAt: -1 })
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Notification list retrieved successfully',
            data: notifications,
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

export const markAsRead = async (
    notificationId: string,
    customerId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const notification = await Notification.findById(notificationId);

        if (!notification) {
            return {
                statusCode: 404,
                success: false,
                message: 'Notification not found',
            };
        }

        if (notification.user.toString() !== customerId.toString()) {
            return {
                statusCode: 401,
                success: false,
                message: 'Unauthorized to mark notification as read',
            };
        }

        await Notification.updateOne(
            {
                _id: notificationId,
                user: customerId,
                organization: { $in: organisation },
                isRead: false,
            },
            {
                $set: {
                    isRead: true,
                },
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Notification marked as read successfully',
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

export const markAllAsRead = async (
    customerId: string,
    organisation: mongoose.Types.ObjectId,
): Promise<AsyncResponseType> => {
    try {
        const notifications = await Notification.find({
            user: customerId,
            organization: { $in: organisation },
            isRead: false,
        }).populate('organization', '_id');

        if (!notifications || notifications.length === 0) {
            return {
                statusCode: 200,
                success: true,
                message: 'No unread notifications found',
            };
        }

        await Notification.updateMany(
            {
                user: customerId,
                organization: { $in: organisation },
                isRead: false,
            },
            { $set: { isRead: true } },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'All unread notifications marked as read successfully',
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
