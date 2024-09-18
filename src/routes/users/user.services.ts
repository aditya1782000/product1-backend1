import mongoose from 'mongoose';
import User from '../../models/user';
import generatepassword from 'generate-password';
import bcrypt from 'bcrypt';
import nodemailer from '../../utils/nodemailer';
import { AsyncResponseType } from '../../test/async';
import Organisation from '../../models/organisation';

interface Permission {
    eKey: string;
    eType: string[];
}

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

const hnadleEmployeeCreation = async (
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
            return await hnadleEmployeeCreation(
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
