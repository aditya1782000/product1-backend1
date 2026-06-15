import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGstPercentage extends Document {
    gstPercentage: number;
    isActive: boolean;
}

const GstPercentageSchema: Schema<IGstPercentage> = new Schema<IGstPercentage>(
    {
        gstPercentage: { type: Number, required: true },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const GstPercentage: Model<IGstPercentage> = mongoose.model<IGstPercentage>(
    'GstPercentage',
    GstPercentageSchema,
);

export default GstPercentage;
