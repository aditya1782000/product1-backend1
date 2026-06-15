import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomerType extends Document {
    customerType: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
}

const CustomerTypeSchema: Schema<ICustomerType> = new Schema<ICustomerType>(
    {
        customerType: { type: String, required: true },
        isActive: {
            type: Boolean,
            default: true,
        },
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'organisation',
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const CustomerType: Model<ICustomerType> = mongoose.model<ICustomerType>(
    'customerType',
    CustomerTypeSchema,
);

export default CustomerType;
