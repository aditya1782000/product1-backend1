import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICustomChallanOrg extends Document {
    challanOrg: string;
    title: string;
    address: string;
    gstNo: string;
    panNo: string;
    headerContent: string;
    footerOne: string;
    footerTwo: string;
    footerThree: string;
    footerFour: string;
    footerFive: string;
    organization: mongoose.Types.ObjectId;
}

export const CustomChallanOrgSchema: Schema<ICustomChallanOrg> =
    new Schema<ICustomChallanOrg>(
        {
            challanOrg: {
                type: String,
                required: true,
            },
            title: {
                type: String,
            },
            address: {
                type: String,
                required: true,
            },
            gstNo: {
                type: String,
                required: true,
            },
            panNo: {
                type: String,
                required: true,
            },
            headerContent: {
                type: String,
                required: true,
            },
            footerOne: {
                type: String,
            },
            footerTwo: {
                type: String,
            },
            footerThree: {
                type: String,
            },
            footerFour: {
                type: String,
            },
            footerFive: {
                type: String,
            },
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
            },
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const CustomChallanOrg: Model<ICustomChallanOrg> =
    mongoose.model<ICustomChallanOrg>(
        'customChallanOrgs',
        CustomChallanOrgSchema,
    );

export default CustomChallanOrg;
