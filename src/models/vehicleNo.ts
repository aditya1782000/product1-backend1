import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IVehicleNo extends Document {
    vehicleNo: string;
    isActive: boolean;
    organization: mongoose.Types.ObjectId;
}

const VehicleNoSchema: Schema<IVehicleNo> = new Schema<IVehicleNo>(
    {
        vehicleNo: { type: String, required: true },
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

const VehicleNo: Model<IVehicleNo> = mongoose.model<IVehicleNo>(
    'VehicleNo',
    VehicleNoSchema,
);

export default VehicleNo;
