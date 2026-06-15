import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface IRegistration extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    organisations: mongoose.Types.ObjectId[];
    plan: string;
    place: string;
    role: string;
}

const RegistartionSchema: Schema<IRegistration> = new Schema<IRegistration>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        organisations: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'organisation',
                },
            ],
        },
        plan: {
            type: String,
            required: true,
            enum: data.plan,
            default: 'basic',
        },
        place: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: data.role,
            default: 'superAdmin',
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Registration: Model<IRegistration> = mongoose.model<IRegistration>(
    'registration',
    RegistartionSchema,
);

export default Registration;
