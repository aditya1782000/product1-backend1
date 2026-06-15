import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IOrganisation extends Document {
    organisationName: string;
    gstNumber: string;
    addressLineone: string;
    addressLineTwo: string;
    city: string;
    state: string;
    pinCode: number;
}

export const organisationSchema: Schema<IOrganisation> =
    new Schema<IOrganisation>({
        organisationName: {
            type: String,
            required: true,
        },
        gstNumber: {
            type: String,
            required: true,
        },
        addressLineone: {
            type: String,
            required: true,
        },
        addressLineTwo: {
            type: String,
            required: true,
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
    });

const Organisation: Model<IOrganisation> = mongoose.model<IOrganisation>(
    'organisation',
    organisationSchema,
);

export default Organisation;
