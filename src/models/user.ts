import mongoose, { Document, Model, Schema } from 'mongoose';
import data from '../../enum';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: number;
    hash: string;
    role: string;
    type: string;
    permissions: IPermission[];
    organization: mongoose.Types.ObjectId[];
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
    gstNumber?: string;
    isActive?: boolean;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    state?: string;
    pinCode?: number;
}

export interface IPermission extends Document {
    eKey: string;
    eType: string[];
}

const permissionSchema: Schema<IPermission> = new Schema<IPermission>(
    {
        eKey: { type: String, enum: data.permission },
        eType: { type: [String], enum: data.permissionType },
    },
    { _id: false },
);

const UserSchema: Schema<IUser> = new Schema<IUser>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
        },
        phoneNumber: {
            type: Number,
            unique: true,
        },
        hash: String,
        role: {
            type: String,
            enum: data.role,
        },
        type: {
            type: String,
        },
        permissions: { type: [permissionSchema] },
        organization: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'organisation',
                },
            ],
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        gstNumber: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        addressLineOne: String,
        addressLineTwo: String,
        city: String,
        state: String,
        pinCode: Number,
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const User: Model<IUser> = mongoose.model<IUser>('users', UserSchema);

export default User;
