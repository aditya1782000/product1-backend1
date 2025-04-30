import Registration from '../../models/register';
import User from '../../models/user';
import { AsyncResponseType } from '../../types/async';
import generatepassword from 'generate-password';
import bcrypt from 'bcrypt';
import nodemailer from '../../utils/nodemailer';
import Organisation from '../../models/organisation';

export const registerUser = async (
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: number,
    organisationName: string,
    gstNumber: string,
    addressLineone: string,
    addressLineTwo: string,
    city: string,
    state: string,
    pinCode: number,
    plan: string,
    place: string,
): Promise<AsyncResponseType> => {
    try {
        const exisitngUser = await Registration.findOne({ email });

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

        const organization = await Organisation.create({
            organisationName,
            gstNumber,
            addressLineone,
            addressLineTwo,
            city,
            state,
            pinCode,
        });

        const role = 'superAdmin';

        await Registration.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            organisations: [organization._id],
            plan,
            place,
        });

        await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            hash,
            role,
            organization: [organization._id],
        });

        await nodemailer.send(
            'register_user.html',
            {
                SITE_NAME: process.env.SITE_NAME,
                USERNAME: `${firstName} ${lastName}`,
                EMAIL: email,
                PASSWORD: password,
                ADMINPANELLINK: process.env.CLIENT_URL,
            },
            {
                from: process.env.SMTP_USERNAME,
                to: email,
                subject: 'Registration Successful',
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'You have registered successfully',
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
