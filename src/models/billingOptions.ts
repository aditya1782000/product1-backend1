import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBillingOptions extends Document {
    billingOption: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
}

const BillingOptionsSchema: Schema<IBillingOptions> =
    new Schema<IBillingOptions>(
        {
            billingOption: { type: String, required: true },
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

const BillingOption: Model<IBillingOptions> = mongoose.model<IBillingOptions>(
    'BillingOption',
    BillingOptionsSchema,
);

export default BillingOption;
