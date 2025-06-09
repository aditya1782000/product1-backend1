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
    inventoryPermission: IInventoryPermission[];
    organization: mongoose.Types.ObjectId[];
    orgnaizationName?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: number;
    gstNumber?: string;
    isActive?: boolean;
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    state?: string;
    pinCode?: number;
    otp?: number;
    otpExpires?: number;
    fcmToken?: string;
    profilePic?: string;
    isDeleted?: boolean;
    isBillingOption?: boolean;
    isAppAccess?: boolean;
    warehouseIds?: string[];
    inventoryAccessLevel: string;
}

export interface IPermission extends Document {
    eKey: string;
    eType: string[];
}

export interface IInventoryPermission extends Document {
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

const inventoryPermissionSchema: Schema<IInventoryPermission> =
    new Schema<IInventoryPermission>({
        eKey: { type: String, enum: data.invetoryPermission },
        eType: { type: [String], enum: data.permissionType },
    });

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
            // unique: true,
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
            // enum: data.customerType
        },
        permissions: { type: [permissionSchema] },
        inventoryPermission: { type: [inventoryPermissionSchema] },
        organization: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'organisation',
                },
            ],
        },
        orgnaizationName: String,
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
        otp: Number,
        otpExpires: Number,
        fcmToken: String,
        profilePic: String,
        isDeleted: Boolean,
        isBillingOption: Boolean,
        isAppAccess: Boolean,
        warehouseIds: {
            type: [String],
        },
        inventoryAccessLevel: {
            type: String,
            enum: data.inventoryAccessLevel,
        },
    },
    { timestamps: { createdAt: 'dCreatedAt', updatedAt: 'dUpdatedAt' } },
);

const User: Model<IUser> = mongoose.model<IUser>('users', UserSchema);

export default User;
