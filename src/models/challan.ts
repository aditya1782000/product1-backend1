import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IChallanItem extends Document {
    particulars: string;
    qty: number;
    rate: number;
}

export interface IChallan extends Document {
    challanOrg: mongoose.Types.ObjectId;
    challanNo: string;
    customerName: string;
    address: string;
    date: Date;
    items: IChallanItem[];
    total: number;
    challanUrl: string;
    dCreatedAt?: Date;
}

const challanItemSchema: Schema<IChallanItem> = new Schema<IChallanItem>({
    particulars: {
        type: String,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
});

export const challanSchema: Schema<IChallan> = new Schema<IChallan>(
    {
        challanOrg: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'challanOrganizations',
        },
        challanNo: {
            type: String,
            required: true,
        },
        customerName: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        items: [challanItemSchema],
        total: {
            type: Number,
            required: true,
        },
        challanUrl: String,
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const Challan: Model<IChallan> = mongoose.model<IChallan>(
    'challans',
    challanSchema,
);

export default Challan;
