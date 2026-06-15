import { Request, Response } from 'express';
import {
    customerLogin,
    resendCustomerOtp,
    resendOtp,
    userChangePassword,
    userLogin,
    userLogout,
    userPasswordReset,
    userReserPasswordPost,
    userResetPasswordGet,
    verifyCustomerOtp,
    verifyOtp,
} from './auth.services';
import { ValidationError, validationResult } from 'express-validator';

export const userLoginController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email, password } = req.body;

    const oResponse = await userLogin(email, password);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const verifyOtpControllers = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email, otp } = req.body;

    const oResponse = await verifyOtp(email, otp);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const resendOtpControllers = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email } = req.body;

    const oResponse = await resendOtp(email);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const userPasswordResetController = async (
    req: Request,
    res: Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email } = req.body;

    const oResponse = await userPasswordReset(email);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const userPasswordResetGetController = async (
    req: Request,
    res: Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }
    const { token } = req.params;

    const oResponse = await userResetPasswordGet(token);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const userPasswordReserPostController = async (
    req: Request,
    res: Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { password, confirmPassword } = req.body;

    const { token } = req.params;

    const oResponse = await userReserPasswordPost(
        password,
        confirmPassword,
        token,
    );

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const userLogoutController = async (req: Request, res: Response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const oResponse = await userLogout(userId);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const userChangePasswordController = async (
    req: Request,
    res: Response,
) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;

    const { oldPassword, newPassword, confirmPassword } = req.body;

    const oResponse = await userChangePassword(
        userId,
        oldPassword,
        newPassword,
        confirmPassword,
    );

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const customerLoginController = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email, password } = req.body;

    const oResponse = await customerLogin(email, password);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const customerOptVerifyController = async (
    req: Request,
    res: Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email, otp, fcmToken } = req.body;

    const oResponse = await verifyCustomerOtp(email, otp, fcmToken);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};

export const resentVerifyCustomerOtpController = async (
    req: Request,
    res: Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error: ValidationError) => error.msg)
            .join(', ');
        return res.status(422).json({
            success: false,
            message: errorMessages,
        });
    }

    const { email } = req.body;

    const oResponse = await resendCustomerOtp(email);

    return res
        .status(oResponse.statusCode)
        .send({ ...oResponse, statusCode: undefined });
};
