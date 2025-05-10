import { Request } from 'express';
import mongoose from 'mongoose';
import User from '../../models/user';
import generatepassword from 'generate-password';
import bcrypt from 'bcrypt';
import nodemailer from '../../utils/nodemailer';
import { AsyncResponseType } from '../../types/async';
import Organisation from '../../models/organisation';
import dataTable from '../../utils/dataTable';
import enums from '../../../enum';
import {
    deleteFileFromS3,
    extractS3Key,
    uploadFileToS3,
} from '../../utils/aws';
import fs from 'fs';

const deleteTempFile = (filePath: string) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${filePath}`, err);
        }
    });
};

interface Permission {
    eKey: string;
    eType: string[];
}

type UpdateUserOption = {
    firstName?: string;
    lastName?: string;
    email?: string;
    type?: string;
    phoneNumber?: number;
    permissions?: Permission[];
    addressLineOne?: string;
    addressLineTwo?: string;
    orgnaizationName?: string;
    gstNumber?: string;
    city?: string;
    state?: string;
    pinCode?: number;
    isBillingOption?: boolean;
    isAppAccess?: boolean;
    hash?: string;
};

const handleSubAdminCreation = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    role: string,
    permissions: Permission[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    const exisitngUser = await User.findOne({
        email,
        isDeleted: { $ne: true },
    });

    if (exisitngUser) {
        return {
            statusCode: 409,
            success: false,
            message: 'User with this email already exists',
        };
    }

    const password: string = generatepassword.generate({
        length: 10,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: true,
    });

    const hash = await bcrypt.hash(password, 10);

    await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        hash,
        role,
        permissions,
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
        organization: [organisation],
    });

    const organisations = await Organisation.find({
        _id: { $in: organisation },
    });

    await nodemailer.send(
        'create_subAdmin.html',
        {
            SITENAME: process.env.SITE_NAME,
            USERNAME: `${firstName} ${lastName}`,
            EMAIL: email,
            PASSWORD: password,
            PERMISSIONS: permissions.map(
                (permission) => `${permission.eKey} ${permission.eType}`,
            ),
            ORGANIZATIONS: organisations.map((org) => org.organisationName),
            ADMINPANELLINK: process.env.CLIENT_URL,
        },
        {
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: 'Sub-Admin Account Created',
        },
    );

    return {
        statusCode: 200,
        success: true,
        message: 'Sub-Admin created successfully',
    };
};

const handleCutomerCreation = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    role: string,
    type: string,
    organisation: mongoose.Types.ObjectId[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
    orgnaizationName: string,
    gstNumber: string,
    isBillingOption: boolean,
    isAppAccess: boolean,
): Promise<AsyncResponseType> => {
    const exisitngUser = await User.findOne({
        email,
        isDeleted: { $ne: true },
    });

    if (exisitngUser) {
        return {
            statusCode: 409,
            success: false,
            message: 'User with this email already exists',
        };
    }

    if (isAppAccess === true && !email) {
        return {
            statusCode: 400,
            success: false,
            message: 'Email is required for app access',
        };
    }

    if (isAppAccess === true) {
        const password: string = generatepassword.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: true,
        });

        const hash = await bcrypt.hash(password, 10);

        await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            hash,
            role,
            type,
            organization: [organisation],
            addressLineOne,
            addressLineTwo,
            city,
            state,
            pinCode,
            orgnaizationName,
            gstNumber,
            isBillingOption,
            isAppAccess: isAppAccess,
        });

        const organisations = await Organisation.find({
            _id: { $in: organisation },
        });

        await nodemailer.send(
            'create_customer.html',
            {
                SITENAME: process.env.SITE_NAME,
                USERNAME: `${firstName} ${lastName}`,
                EMAIL: email,
                PASSWORD: password,
                ORGANIZATIONS: organisations.map((org) => org.organisationName),
            },
            {
                from: process.env.SMTP_USERNAME,
                to: email,
                subject: 'Customer Account Created',
            },
        );
    } else {
        await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            role,
            type,
            organization: [organisation],
            addressLineOne,
            addressLineTwo,
            city,
            state,
            pinCode,
            orgnaizationName,
            gstNumber,
            isBillingOption,
            isAppAccess: false,
        });
    }

    return {
        statusCode: 200,
        success: true,
        message: 'Customer created successfully',
    };
};

const handleEmployeeCreation = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    role: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    const exisitngUser = await User.findOne({
        email,
        isDeleted: { $ne: true },
    });

    if (exisitngUser) {
        return {
            statusCode: 409,
            success: false,
            message: 'User with this email already exists',
        };
    }

    const password: string = generatepassword.generate({
        length: 10,
        numbers: true,
        uppercase: true,
        lowercase: true,
        symbols: true,
    });

    const hash = await bcrypt.hash(password, 10);

    await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        hash,
        role,
        organization: [organisation],
    });

    const organisations = await Organisation.find({
        _id: { $in: organisation },
    });

    await nodemailer.send(
        'create_employee.html',
        {
            SITENAME: process.env.SITE_NAME,
            USERNAME: `${firstName} ${lastName}`,
            EMAIL: email,
            PASSWORD: password,
            ORGANIZATIONS: organisations.map((org) => org.organisationName),
        },
        {
            from: process.env.SMTP_USERNAME,
            to: email,
            subject: 'Employee Account Created',
        },
    );

    return {
        statusCode: 200,
        success: true,
        message: 'Employee created successfully',
    };
};

export const addUsers = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    role: string,
    type: string,
    permissions: Permission[],
    organisation: mongoose.Types.ObjectId[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
    orgnaizationName: string,
    gstNumber: string,
    isBillingOption: boolean,
    isAppAccess: boolean,
): Promise<AsyncResponseType> => {
    try {
        if (role === 'customer') {
            return await handleCutomerCreation(
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                type,
                organisation,
                addressLineOne,
                addressLineTwo,
                city,
                state,
                pinCode,
                orgnaizationName,
                gstNumber,
                isBillingOption,
                isAppAccess,
            );
        } else if (role == 'employee') {
            return await handleEmployeeCreation(
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                organisation,
            );
        } else {
            return await handleSubAdminCreation(
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                permissions,
                addressLineOne,
                addressLineTwo,
                city,
                state,
                pinCode,
                organisation,
            );
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const usersList = async (
    req: Request,
    start: number,
    limit: number,
    role: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const searchFields = ['firstName', 'lastName', 'email'];
        const numberFields = ['phoneNumber'];

        const oData = dataTable.initDataTable(
            req.body,
            searchFields,
            'srNo',
            numberFields,
        );

        let selectedFields = '';
        if (role === 'subAdmin') {
            selectedFields =
                'firstName lastName email phoneNumber permissions organization isActive';
        } else if (role == 'customer') {
            selectedFields =
                'firstName lastName email phoneNumber organization type addressLineOne addressLineTwo city state pinCode isActive orgnaizationName gstNumber';
        } else if (role === 'employee') {
            selectedFields =
                'firstName lastName email phoneNumber organization isActive';
        }

        const nRecordsTotal = await User.countDocuments({
            organization: { $in: organisation },
            isDeleted: { $ne: true },
            role,
        });

        const userList = await User.find({
            $and: [oData.oSearchData],
            organization: { $in: organisation },
            isDeleted: { $ne: true },
            role,
        })
            .select(selectedFields)
            .collation({ locale: 'en', strength: 1 })
            .sort(oData.oSortingOrder)
            .skip(start)
            .limit(limit)
            .lean();

        return {
            statusCode: 200,
            success: true,
            message: 'Users fetched successfully',
            data: userList,
            draw: req.body.draw,
            recordsTotal: nRecordsTotal,
            recordsFiltered: userList.length || 0,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const userView = async (
    userId: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const selectedFields =
            'firstName lastName email phoneNumber role permissions type isActive addressLineOne addressLineTwo city state pinCode orgnaizationName gstNumber isBillingOption isAppAccess profilePic';

        const oUser = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true },
        })
            .populate('organization', '_id')
            .select(selectedFields)
            .lean();

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (
            oUser.organization.some(
                (org) =>
                    org._id && org._id.toString() !== organisation.toString(),
            )
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'User fetched successfully',
            data: oUser,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const userToggleStatus = async (
    userId: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true },
        }).populate('organization', '_id');

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (
            oUser.organization &&
            oUser.organization.some(
                (org) =>
                    org._id && org._id.toString() !== organisation.toString(),
            )
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { isActive: !oUser.isActive },
            { new: true },
        );

        if (!updatedUser) {
            return {
                statusCode: 500,
                success: false,
                message: 'Failed to update user status',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'User status toggled successfully',
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

const updateUser = async (
    userId: string,
    updateUser: UpdateUserOption,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    const oUser = await User.findOne({
        _id: userId,
        isDeleted: { $ne: true },
    }).lean();

    if (updateUser.email && updateUser.email !== oUser?.email) {
        const emailInUse = await User.findOne({
            email: updateUser.email,
            isDeleted: { $ne: true },
        });
        if (emailInUse) {
            return {
                statusCode: 409,
                success: false,
                message: 'User with this email already exists',
            };
        }
    }

    if (!oUser) {
        return {
            statusCode: 404,
            success: false,
            message: 'User not found',
        };
    }

    if (
        oUser.organization.some(
            (org) => org._id && org._id.toString() !== organisation.toString(),
        )
    ) {
        return {
            statusCode: 403,
            success: false,
            message: 'Unauthorized access',
        };
    }

    if (updateUser.isAppAccess === true && !updateUser.email) {
        return {
            statusCode: 400,
            success: false,
            message: 'Email is required for app access',
        };
    }

    if (updateUser.isAppAccess === true && oUser.role === 'customer') {
        if (!oUser.isAppAccess && !oUser.hash) {
            const password: string = generatepassword.generate({
                length: 10,
                numbers: true,
                uppercase: true,
                lowercase: true,
                symbols: true,
            });

            const hash = await bcrypt.hash(password, 10);

            const organisations = await Organisation.find({
                _id: { $in: organisation },
            });

            updateUser.hash = hash;
            updateUser.isAppAccess = true;

            await nodemailer.send(
                'create_customer.html',
                {
                    SITENAME: process.env.SITE_NAME,
                    USERNAME: `${oUser.firstName} ${oUser.lastName}`,
                    EMAIL: updateUser.email,
                    PASSWORD: password,
                    ORGANIZATIONS: organisations.map(
                        (org) => org.organisationName,
                    ),
                },
                {
                    from: process.env.SMTP_USERNAME,
                    to: updateUser.email,
                    subject: 'Customer Account Created',
                },
            );
        } else {
            return {
                statusCode: 400,
                success: false,
                message: 'Customer already have app access.',
            };
        }
    }

    const updateUserData = await User.findByIdAndUpdate(oUser._id, updateUser, {
        new: true,
    });

    if (!updateUserData) {
        return {
            statusCode: 500,
            success: false,
            message: 'Failed to update user',
        };
    }

    if (updateUser.permissions) {
        global.io.emit('permission-updated', {
            message: 'Permissions Updated',
            userId: userId,
            permissions: updateUserData.permissions,
        });
    }

    return {
        statusCode: 200,
        success: true,
        message: 'User updated successfully',
    };
};

export const userEdit = async (
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    role: string,
    type: string,
    permissions: Permission[],
    organisation: mongoose.Types.ObjectId[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
    orgnaizationName: string,
    gstNumber: string,
    isBillingOption: boolean,
    isAppAccess: boolean,
): Promise<AsyncResponseType> => {
    try {
        if (role === 'customer') {
            return await updateUser(
                userId,
                {
                    firstName,
                    lastName,
                    email,
                    type,
                    phoneNumber,
                    addressLineOne,
                    addressLineTwo,
                    city,
                    state,
                    pinCode,
                    orgnaizationName,
                    gstNumber,
                    isBillingOption,
                    isAppAccess,
                },
                organisation,
            );
        } else if (role === 'employee') {
            return await updateUser(
                userId,
                {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                },
                organisation,
            );
        } else {
            return await updateUser(
                userId,
                {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    permissions,
                    addressLineOne,
                    addressLineTwo,
                    city,
                    state,
                    pinCode,
                },
                organisation,
            );
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const userDelete = async (
    userId: string,
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findById(userId);

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (
            oUser.organization.some(
                (org) =>
                    org._id && org._id.toString() !== organisation.toString(),
            )
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        const deleteUser = await User.findByIdAndUpdate(userId, {
            isDeleted: true,
        });

        if (!deleteUser) {
            return {
                statusCode: 500,
                success: false,
                message: 'Failed to delete user',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'User deleted successfully',
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const userPermissions = async (): Promise<AsyncResponseType> => {
    try {
        const aPermission = enums.permission.map((permission) => {
            return { ekey: permission, eType: [] };
        });

        return {
            statusCode: 200,
            success: true,
            message: 'Permissions fetched successfully',
            data: aPermission,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const userProfile = async (
    userId: string,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true },
        })
            .select('firstName lastName email phoneNumber profilePic')
            .lean();

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'User profile fetched successfully',
            data: oUser,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const editUserProfile = async (
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber?: number,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                email,
                phoneNumber,
            },
            { new: true },
        );

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'User profile updated successfully',
            data: oUser,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    }
};

export const setProfilePic = async (
    req: Request,
    userId: string,
): Promise<AsyncResponseType> => {
    let tempFilePath: string | undefined;
    try {
        const oUser = await User.findOne({
            _id: userId,
            isDeleted: { $ne: true },
        });

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        let profileImageUrl: string | undefined;

        if (req.file) {
            if (oUser.profilePic) {
                const key = extractS3Key(oUser.profilePic);
                deleteFileFromS3(key);
            }
            tempFilePath = req.file.path;
            const uploadData = await uploadFileToS3(
                req.file,
                `${Date.now().toString()}`,
                'profile',
            );
            profileImageUrl = uploadData.Location;
        }

        const profilePic = await User.findByIdAndUpdate(
            userId,
            {
                profilePic: profileImageUrl,
            },
            { new: true },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Profile Picture Updated successfully',
            data: profilePic?.profilePic,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                statusCode: 500,
                success: false,
                message: error.message || 'Something went wrong',
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'Something went wrong',
        };
    } finally {
        if (tempFilePath) {
            deleteTempFile(tempFilePath);
        }
    }
};
