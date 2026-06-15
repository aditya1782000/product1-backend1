import { body, param } from 'express-validator';

export const createCustomerTypeValidators = [
    body('customerType')
        .trim()
        .notEmpty()
        .withMessage('Customer Type is required')
        .bail()
        .isString()
        .withMessage('Customer Type must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage('Customer Type must be at least 1 to 25 characters long'),
];

export const deleteCustomerTypeValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
