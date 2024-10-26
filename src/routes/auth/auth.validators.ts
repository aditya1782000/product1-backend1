import { body, param } from 'express-validator';

export const userLoginValidator = [
    body('email')
        .notEmpty()
        .withMessage('Please enter your email')
        .bail()
        .isEmail()
        .withMessage('Please enter valid email'),

    body('password').notEmpty().withMessage('Please enter your password'),
];

export const verifyOtpValidators = [
    body('email')
        .notEmpty()
        .withMessage('Please enter your email')
        .bail()
        .isEmail()
        .withMessage('Please enter valid email'),

    body('otp')
        .notEmpty()
        .withMessage('Please enter Otp')
        .bail()
        .isNumeric()
        .isLength({ min: 4, max: 4 })
        .withMessage('Invalid otp'),
];

export const resendOtpValidators = [
    body('email')
        .notEmpty()
        .withMessage('Please enter your email')
        .bail()
        .isEmail()
        .withMessage('Please enter valid email'),
];

export const userPasswordResetValidator = [
    body('email')
        .notEmpty()
        .withMessage('Please enter your email')
        .bail()
        .isEmail()
        .withMessage('Please enter your valid email'),
];

export const userPasswordResetGetValidator = [
    param('token').notEmpty().withMessage('Please enter your token'),
];

export const userPasswordResetPostValidator = [
    body('password')
        .notEmpty()
        .withMessage('Please enter your password')
        .bail()
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/,
        )
        .withMessage(
            'Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        ),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Please enter confirm password'),
];

export const userChangePasswordValidator = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Please enter your old password'),

    body('newPassword')
        .notEmpty()
        .withMessage('Please enter your password')
        .bail()
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/,
        )
        .withMessage(
            'Password must be 8-15 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
        ),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Please enter confirm password'),
];
