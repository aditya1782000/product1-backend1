import { body } from 'express-validator';
import enums from '../../../enum';

export const registerUserValidators = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .bail()
        .isString()
        .withMessage('First name must be a string')
        .bail()
        .isLength({ min: 3, max: 25 })
        .withMessage('First name must be between 3 and 25 characters'),

    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .bail()
        .isString()
        .withMessage('Last name must be a string')
        .bail()
        .isLength({ min: 3, max: 25 })
        .withMessage('Last name must be between 3 and 25 characters'),

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

    body('organisationName')
        .notEmpty()
        .withMessage('Organisation name is required')
        .bail()
        .isString()
        .withMessage('Organisation name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Organisation name must between 3 to 100'),

    body('gstNumber')
        .notEmpty()
        .withMessage('GST Number is required')
        .bail()
        .isString()
        .withMessage('GST Number must be a string')
        .bail()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .withMessage('Invalid GST Number'),

    body('addressLineone')
        .notEmpty()
        .withMessage('Address 1 is required')
        .bail()
        .isString()
        .withMessage('Address 1 must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Address 1 must between 3 to 100'),

    body('addressLineTwo')
        .notEmpty()
        .withMessage('Address 2 is required')
        .bail()
        .isString()
        .withMessage('Address 2 must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Address 2 must between 3 to 100'),

    body('city')
        .notEmpty()
        .withMessage('City is required')
        .bail()
        .isString()
        .withMessage('City must be a string'),

    body('state')
        .notEmpty()
        .withMessage('State is required')
        .bail()
        .isString()
        .withMessage('State must be a string'),

    body('pinCode')
        .notEmpty()
        .withMessage('Pin code is required')
        .bail()
        .isNumeric()
        .withMessage('Pin code must be a number')
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage('Pin code must be 6 digit'),

    body('plan')
        .notEmpty()
        .withMessage('Plan is required')
        .bail()
        .isIn(enums.plan)
        .withMessage('Invalid plan'),

    body('place')
        .notEmpty()
        .withMessage('Place is required')
        .bail()
        .isString()
        .withMessage('Place must be a string'),
];
