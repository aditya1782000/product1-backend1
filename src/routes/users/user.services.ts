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

        let selectedFileds = '';
        if (role === 'subAdmin') {
            selectedFileds =
                'firstName lastName email permissions organization';
        } else if (role == 'customer') {
            selectedFileds =
                'firstName lastName email phoneNumber organization addressLineOne addressLineTwo city state pinCode';
        } else if (role === 'employee') {
            selectedFileds =
                'firstName lastName email phoneNumber organization';
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
            .select(selectedFileds)
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