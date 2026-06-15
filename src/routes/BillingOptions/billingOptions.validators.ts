import { body, param } from 'express-validator';

export const createBillingOptionValidators = [
    body('billingOption')
        .notEmpty()
        .withMessage('Billing Option is required')
        .bail()
        .isString()
        .withMessage('Billing Option must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage('Billing Option must be at least 1 to 25 characters long'),
];

export const deleteBillingOptionValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
