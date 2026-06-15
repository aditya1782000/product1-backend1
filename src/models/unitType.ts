import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUnitType extends Document {
    unitType: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
}

const UnitTypeSchema: Schema<IUnitType> = new Schema<IUnitType>(
    {
        unitType: { type: String, required: true },
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

const UnitType: Model<IUnitType> = mongoose.model<IUnitType>(
    'UnitType',
    UnitTypeSchema,
);

export default UnitType;
