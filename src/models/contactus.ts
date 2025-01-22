import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IContactUS extends Document {
    name: string;
    phoneNumber: number;
    email: string;
    message: string;
    isReolved: boolean;
}

export const contactUsSchema: Schema<IContactUS> = new Schema<IContactUS>(
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isReolved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const ContactUs: Model<IContactUS> = mongoose.model<IContactUS>(
    'contactus',
    contactUsSchema,
);

export default ContactUs;
