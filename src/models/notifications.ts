import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotifications extends Document {
    title: string;
    description: string;
    imageurl: string;
    isRead: boolean;
    organization: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    type: string;
    dCreatedAt?: Date;
}

export const notificationSchema: Schema<INotifications> =
    new Schema<INotifications>(
        {
            title: {
                type: String,
            },
            description: {
                type: String,
            },
            imageurl: {
                type: String,
            },
            isRead: {
                type: Boolean,
                default: false,
            },
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
            },
            type: {
                type: String,
                required: true,
            },
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const Notification: Model<INotifications> = mongoose.model<INotifications>(
    'notifications',
    notificationSchema,
);

export default Notification;
