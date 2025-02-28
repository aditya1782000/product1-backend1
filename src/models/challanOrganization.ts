import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IChallanOrganization extends Document {
    gstNo?: string;
    mobileNo?: number;
    headingOne?: string;
    headingTwo?: string;
    addressLineOne?: string;
    addressLineTwo?: string;
    footer?: string;
    note?: string;
    logoPath?: string;
    organization: mongoose.Types.ObjectId;
}

export const challanOrganizationSchema: Schema<IChallanOrganization> =
    new Schema<IChallanOrganization>(
        {
            gstNo: {
                type: String,
                required: true,
            },
            mobileNo: {
                type: Number,
                required: true,
            },
            headingOne: {
                type: String,
                required: true,
            },
            headingTwo: {
                type: String,
                required: true,
            },
            addressLineOne: {
                type: String,
                required: true,
            },
            addressLineTwo: {
                type: String,
                required: true,
            },
            footer: String,
            note: String,
            logoPath: String,
            organization: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'organisation',
            },
        },
        { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
    );

const ChallanOrganization: Model<IChallanOrganization> =
    mongoose.model<IChallanOrganization>(
        'challanOrganizations',
        challanOrganizationSchema,
    );

export default ChallanOrganization;
