import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INotificationType extends Document {
    notificationType: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
    isAll: boolean;
}

const NotificationTypeSchema: Schema<INotificationType> =
    new Schema<INotificationType>(
        {
            notificationType: { type: String, required: true },
            isActive: {
                type: Boolean,
                default: true,
            },
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
            },
            isAll: Boolean,
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const NotificationType: Model<INotificationType> =
    mongoose.model<INotificationType>(
        'NotificationType',
        NotificationTypeSchema,
    );

export default NotificationType;
