import { body } from 'express-validator';

export const addContactUsValidators = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .bail()
        .isString()
        .withMessage('Name must be a string')
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Email is invalid'),
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .bail()
        .isString()
        .withMessage('Message must be a string')
        .bail()
        .isLength({ min: 5, max: 500 })
        .withMessage('Message must be between 5 and 500 characters'),
];
