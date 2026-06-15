import { body } from 'express-validator';

export const addDeliveryAddressValidators = [
    body('addressLineOne')
        .trim()
        .notEmpty()
        .withMessage('Address Line one is required')
        .bail()
        .isString()
        .withMessage('Address Line one must be a string')
        .bail()
        .isLength({ min: 1, max: 500 })
        .withMessage('Address Line one must at least 1 to 500 Characters long'),

    body('addressLineTwo')
        .trim()
        .notEmpty()
        .withMessage('Address Line two is required')
        .bail()
        .isString()
        .withMessage('Address Line two must be a string')
        .bail()
        .isLength({ min: 1, max: 500 })
        .withMessage('Address Line two must at least 1 to 500 Characters long'),

    body('city')
        .trim()
        .notEmpty()
        .withMessage('City is required')
        .bail()
        .isString()
        .withMessage('City must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage('City must at least 1 to 25 Characters long'),

    body('state')
        .trim()
        .notEmpty()
        .withMessage('State is required')
        .bail()
        .isString()
        .withMessage('State must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage('State must at least 1 to 25 Characters long'),

    body('pinCode')
        .notEmpty()
        .withMessage('Pin code is required')
        .bail()
        .isNumeric()
        .withMessage('Pin code must be a number')
        .bail()
        .isLength({ min: 6, max: 6 })
        .withMessage('Pin code must be 6 digit'),
];
