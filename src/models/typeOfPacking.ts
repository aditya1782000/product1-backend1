import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITypeOfPacking extends Document {
    typeOfPacking: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
}

const TypeOfPackingSchema: Schema<ITypeOfPacking> = new Schema<ITypeOfPacking>(
    {
        typeOfPacking: { type: String, required: true },
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

const TypeOfPacking: Model<ITypeOfPacking> = mongoose.model<ITypeOfPacking>(
    'TypeOfpacking',
    TypeOfPackingSchema,
);

export default TypeOfPacking;
