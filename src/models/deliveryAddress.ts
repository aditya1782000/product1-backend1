import mongoose, { Model, Schema } from 'mongoose';

export interface IDeliveryAddress extends Document {
    addressLineOne: string;
    addressLineTwo?: string;
    city: string;
    state: string;
    pinCode: number;
    customer: mongoose.Types.ObjectId;
    organization: mongoose.Types.ObjectId;
}

const DeliveryAddressSchema: Schema<IDeliveryAddress> =
    new Schema<IDeliveryAddress>(
        {
            addressLineOne: {
                type: String,
                required: true,
            },
            addressLineTwo: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pinCode: {
                type: Number,
                required: true,
            },
            customer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true,
            },
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
                required: true,
            },
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const DeliveryAddress: Model<IDeliveryAddress> =
    mongoose.model<IDeliveryAddress>('DeliveryAddress', DeliveryAddressSchema);

export default DeliveryAddress;
