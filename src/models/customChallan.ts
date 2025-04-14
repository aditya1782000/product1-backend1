import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomChallanItem extends Document {
    productName: string;
    typeOfPacking?: string;
    bagBoxes?: number;
    qty: number;
    rate: number;
}

export interface ICustomChallan extends Document {
    customChallanOrg: mongoose.Types.ObjectId;
    challanNo: string;
    customerName: string;
    customerMobileNo: number;
    address: string;
    partyCode?: string;
    nameOfTransport?: string;
    lrNo?: string;
    orderNo: string;
    date: Date;
    dated: Date;
    vehicleNo: string;
    items: ICustomChallanItem[];
    total: number;
    challanUrl: string;
    dCreatedAt?: Date;
}

const CusotmeChallanItemSchema: Schema<ICustomChallanItem> =
    new Schema<ICustomChallanItem>({
        productName: {
            type: String,
            required: true,
        },
        typeOfPacking: String,
        bagBoxes: String,
        qty: {
            type: Number,
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
    });

export const CustomChallanSchema: Schema<ICustomChallan> =
    new Schema<ICustomChallan>(
        {
            customChallanOrg: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'customChallanOrgs',
            },
            challanNo: {
                type: String,
                required: true,
            },
            customerName: {
                type: String,
                required: true,
            },
            customerMobileNo: {
                type: Number,
            },
            date: {
                type: Date,
                required: true,
            },
            dated: {
                type: Date,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            partyCode: String,
            nameOfTransport: String,
            orderNo: String,
            lrNo: String,
            items: [CusotmeChallanItemSchema],
            vehicleNo: String,
            total: {
                type: Number,
                required: true,
            },
            challanUrl: String,
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const CustomChallan: Model<ICustomChallan> = mongoose.model<ICustomChallan>(
    'customChallans',
    CustomChallanSchema,
);

export default CustomChallan;
