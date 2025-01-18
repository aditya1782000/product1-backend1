import User from '../../models/user';
import { AsyncResponseType } from '../../types/async';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from '../../utils/nodemailer';
import otpGenerator from 'otp-generator';

const { JWT_SECRET } = process.env;
const jwtSecret = process.env.JWT_SECRET || JWT_SECRET;

export const userLogin = async (
    email: string,
    password: string,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({ email });

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (oUser.isActive === false) {
            return {
                statusCode: 406,
                success: false,
                message: 'User is not active',
            };
        }

        const passwordMatch: boolean = await bcrypt.compare(
            password,
            oUser.hash,
        );

        if (!passwordMatch) {
            return {
                statusCode: 406,
                success: false,
                message: 'Invalid password',
            };
        }

        const otpGenerate: number = parseInt(
            otpGenerator
                .generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                })
                .padStart(4, '0'),
            10,
        );

        const otpExpires = Date.now() + 5 * 60 * 1000;

        oUser.otp = otpGenerate;
        oUser.otpExpires = otpExpires;

        await oUser.save();

        await nodemailer.send(
            'send_otp.html',
            {
                SITENAME: process.env.SITE_NAME,
                OTP: otpGenerate,
            },
            {
                from: process.env.SMTP_USERNAME,
                to: oUser.email,
                subject: '`OTP Verification',
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Otp send successfully to your email',
            data: { email },
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

export const verifyOtp = async (
    email: string,
    otp: number,
): Promise<AsyncResponseType> => {
    try {
        let token: string = '';

        const oUser = await User.findOne({ email }).populate(
            'organization',
            'organisationName',
        );

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (!oUser.otp || !oUser.otpExpires) {
            return {
                statusCode: 404,
                success: false,
                message: 'OTP not found',
            };
        }

        if (Date.now() > oUser.otpExpires) {
            return {
                statusCode: 406,
                success: false,
                message: 'OTP expired',
            };
        }

        if (otp !== oUser.otp) {
            return {
                statusCode: 406,
                success: false,
                message: 'Invalid OTP',
            };
        }

        token = jwt.sign({ id: oUser._id }, jwtSecret as string, {
            expiresIn: process.env.JWT_EXPIRES_IN as string,
        });

        oUser.otp = undefined;
        oUser.otpExpires = undefined;
        await oUser.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Otp verified successfully',
            data: {
                token,
                email: oUser.email || '',
                firstName: oUser.firstName || '',
                lastName: oUser.lastName || '',
                phoneNumber: oUser.phoneNumber || '',
                role: oUser.role || '',
                permissions: oUser.permissions || '',
                organization: oUser.organization || '',
                _id: oUser._id || '',
            },
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

export const resendOtp = async (email: string): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({ email });

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        const otpGenerate: number = parseInt(
            otpGenerator
                .generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                })
                .padStart(4, '0'),
            10,
        );

        const otpExpires = Date.now() + 5 * 60 * 1000;

        oUser.otp = otpGenerate;
        oUser.otpExpires = otpExpires;
        await oUser.save();

        await nodemailer.send(
            'send_otp.html',
            {
                SITENAME: process.env.SITE_NAME,
                OTP: otpGenerate,
            },
            {
                from: process.env.SMTP_USERNAME,
                to: oUser.email,
                subject: '`OTP Verification',
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Otp resend successfully to your email',
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

export const userPasswordReset = async (
    email: string,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({ email });

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (oUser.isActive === false) {
            return {
                statusCode: 406,
                success: false,
                message: 'User is not active',
            };
        }

        const randomHash: string = crypto.randomBytes(20).toString('hex');

        const sResetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${randomHash}`;

        await nodemailer.send(
            'reset_password.html',
            {
                FIRSTNAME: oUser.firstName,
                LASTNAME: oUser.lastName,
                RESETPASSWORDLINK: sResetPasswordLink,
            },
            {
                from: process.env.SMTP_USERNAME,
                to: email,
                subject: 'Password Reset Request',
            },
        );

        oUser.resetPasswordToken = randomHash;
        oUser.resetPasswordExpires = Date.now() + 300000;
        await oUser.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Password reset link has been sent to your email',
            data: {
                resetPasswordToken: randomHash,
            },
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

export const userResetPasswordGet = async (
    token: string,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!oUser) {
            return {
                statusCode: 417,
                success: false,
                message: 'Password reset token is invalid or expired',
            };
        }

        if (oUser.isActive === false) {
            return {
                statusCode: 406,
                success: false,
                message: 'User is not active',
            };
        }

        return {
            statusCode: 200,
            success: true,
            message: 'Password reset token is valid',
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

export const userReserPasswordPost = async (
    password: string,
    confirmPassword: string,
    token: string,
): Promise<AsyncResponseType> => {
    try {
        if (password !== confirmPassword) {
            return {
                statusCode: 406,
                success: false,
                message: 'Passwords do not match',
            };
        }

        const oUser = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!oUser) {
            return {
                statusCode: 417,
                success: false,
                message: 'Password reset token is invalid or expired',
            };
        }

        oUser.hash = await bcrypt.hash(password, 10);
        oUser.resetPasswordToken = '';
        oUser.resetPasswordExpires = 0;
        await oUser.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Password has been reset successfully',
            data: {
                role: oUser.role,
            },
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

export const userLogout = async (
    userId: string,
): Promise<AsyncResponseType> => {
    try {
        await User.findByIdAndUpdate(userId, {
            token: '',
        });

        return {
            statusCode: 200,
            success: true,
            message: 'User logged out successfully',
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

export const userChangePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
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

        const passwordMatch: boolean = await bcrypt.compare(
            oldPassword,
            oUser.hash,
        );

        if (!passwordMatch) {
            return {
                statusCode: 406,
                success: false,
                message: 'Invalid old password',
            };
        }

        if (newPassword !== confirmPassword) {
            return {
                statusCode: 406,
                success: false,
                message: 'Passwords do not match',
            };
        }

        oUser.hash = await bcrypt.hash(newPassword, 10);
        await oUser.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Password has been changed successfully',
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

export const customerLogin = async (
    email: string,
    password: string,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({ email });

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (oUser.isActive === false) {
            return {
                statusCode: 406,
                success: false,
                message: 'User is not active',
            };
        }

        if (oUser.role === 'superAdmin' || oUser.role === 'subAdmin') {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        const passwordMatch: boolean = await bcrypt.compare(
            password,
            oUser.hash,
        );

        if (!passwordMatch) {
            return {
                statusCode: 406,
                success: false,
                message: 'Invalid password',
            };
        }

        const otpGenerate: number = parseInt(
            otpGenerator
                .generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                })
                .padStart(4, '0'),
            10,
        );

        const otpExpires = Date.now() + 5 * 60 * 1000;

        oUser.otp = otpGenerate;
        oUser.otpExpires = otpExpires;

        await oUser.save();

        await nodemailer.send(
            'send_otp.html',
            {
                SITENAME: process.env.SITE_NAME,
                OTP: otpGenerate,
            },
            {
                from: process.env.SMTP_USERNAME,
                to: oUser.email,
                subject: '`OTP Verification',
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Otp send successfully to your email',
            data: { email },
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

export const verifyCustomerOtp = async (
    email: string,
    otp: number,
): Promise<AsyncResponseType> => {
    try {
        let token: string = '';

        const oUser = await User.findOne({ email }).populate(
            'organization',
            'organisationName',
        );

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        if (!oUser.otp || !oUser.otpExpires) {
            return {
                statusCode: 404,
                success: false,
                message: 'OTP not found',
            };
        }

        if (Date.now() > oUser.otpExpires) {
            return {
                statusCode: 406,
                success: false,
                message: 'OTP expired',
            };
        }

        if (otp !== oUser.otp) {
            return {
                statusCode: 406,
                success: false,
                message: 'Invalid OTP',
            };
        }

        token = jwt.sign({ id: oUser._id }, jwtSecret as string, {
            expiresIn: process.env.JWT_EXPIRES_IN as string,
        });

        oUser.otp = undefined;
        oUser.otpExpires = undefined;
        await oUser.save();

        return {
            statusCode: 200,
            success: true,
            message: 'Otp verified successfully',
            data: {
                token,
                email: oUser.email || '',
                firstName: oUser.firstName || '',
                lastName: oUser.lastName || '',
                phoneNumber: oUser.phoneNumber || '',
                role: oUser.role || '',
                organization: oUser.organization || '',
                _id: oUser._id || '',
            },
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

export const resendCustomerOtp = async (
    email: string,
): Promise<AsyncResponseType> => {
    try {
        const oUser = await User.findOne({ email });

        if (!oUser) {
            return {
                statusCode: 404,
                success: false,
                message: 'User not found',
            };
        }

        const otpGenerate: number = parseInt(
            otpGenerator
                .generate(4, {
                    upperCaseAlphabets: false,
                    specialChars: false,
                    digits: true,
                    lowerCaseAlphabets: false,
                })
                .padStart(4, '0'),
            10,
        );

        const otpExpires = Date.now() + 5 * 60 * 1000;

        oUser.otp = otpGenerate;
        oUser.otpExpires = otpExpires;
        await oUser.save();

        await nodemailer.send(
            'send_otp.html',
            {
                SITENAME: process.env.SITE_NAME,
                OTP: otpGenerate,
            },
            {
                from: process.env.SMTP_USERNAME,
                to: oUser.email,
                subject: '`OTP Verification',
            },
        );

        return {
            statusCode: 200,
            success: true,
            message: 'Otp resend successfully to your email',
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
