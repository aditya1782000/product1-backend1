import { Request } from 'express';
import mongoose from 'mongoose';
import User from '../../models/user';
import generatepassword from 'generate-password';
import bcrypt from 'bcrypt';
import nodemailer from '../../utils/nodemailer';
import { AsyncResponseType } from '../../test/async';
import Organisation from '../../models/organisation';
import dataTable from '../../utils/dataTable';

interface Permission {
    eKey: string;
    eType: string[];
}

type UpdateUserOption = {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: number;
    permissions?: Permission[];
    addressLineOne?: string;
    addressLineTwo?: string;
    city?: string;
    state?: string;
    pinCode?: number;
};

const handleSubAdminCreation = async (
    firstName: string,
    lastName: string,
    email: string,
    role: string,
    permissions: Permission[],
    organisation: mongoose.Types.ObjectId[],
): Promise<AsyncResponseType> => {
    const exisitngUser = await User.findOne({ email });

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
        hash,
        role,
        permissions,
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
    organisation: mongoose.Types.ObjectId[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
): Promise<AsyncResponseType> => {
    const exisitngUser = await User.findOne({ email });

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
        addressLineOne,
        addressLineTwo,
        city,
        state,
        pinCode,
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
    const exisitngUser = await User.findOne({ email });

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
    permissions: Permission[],
    organisation: mongoose.Types.ObjectId[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
): Promise<AsyncResponseType> => {
    try {
        if (role === 'customer') {
            return await handleCutomerCreation(
                firstName,
                lastName,
                email,
                phoneNumber,
                role,
                organisation,
                addressLineOne,
                addressLineTwo,
                city,
                state,
                pinCode,
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
                role,
                permissions,
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
                'firstName lastName email permissions organization isActive';
        } else if (role == 'customer') {
            selectedFields =
                'firstName lastName email phoneNumber organization addressLineOne addressLineTwo city state pinCode isActive';
        } else if (role === 'employee') {
            selectedFields =
                'firstName lastName email phoneNumber organization isActive';
        }

        const nRecordsTotal = await User.countDocuments({
            organization: { $in: organisation },
            role,
        });

        const userList = await User.find({
            $and: [oData.oSearchData],
            organization: { $in: organisation },
            role,
        })
            .select(selectedFields)
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
            'firstName lastName email phoneNumber role permisssions isActive addressLineOne addressLineTwo city state pinCode';

        const oUser = await User.findById({
            _id: userId,
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
                (org) => org._id.toString() !== organisation.toString(),
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
        const oUser = await User.findById({ _id: userId }).populate(
            'organization',
            '_id',
        );
        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (
            oUser.organization.some(
                (org) => org._id.toString() !== organisation.toString(),
            )
        ) {
            return {
                statusCode: 403,
                success: false,
                message: 'Unauthorized access',
            };
        }

        oUser.isActive = !oUser.isActive;

        await oUser.save();

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
    if (updateUser.email) {
        const existingUser = await User.findOne({ email: updateUser.email });
        if (existingUser && existingUser._id !== userId) {
            return {
                statusCode: 409,
                success: false,
                message: 'User with this email already exists',
            };
        }
    }

    const updateUserData = await User.findByIdAndUpdate(userId, updateUser, {
        new: true,
    }).populate('organization', '_id');

    if (!updateUser) {
        return {
            statusCode: 404,
            success: false,
            message: 'User not found',
        };
    }

    if (
        updateUserData?.organization.some(
            (org) => org._id.toString() !== organisation.toString(),
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
    permissions: Permission[],
    organisation: mongoose.Types.ObjectId[],
    addressLineOne: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
): Promise<AsyncResponseType> => {
    try {
        if (role === 'customer') {
            return await updateUser(
                userId,
                {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    addressLineOne,
                    addressLineTwo,
                    city,
                    state,
                    pinCode,
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
