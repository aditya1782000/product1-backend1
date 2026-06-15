import { body } from 'express-validator';

export const listStatementsValidators = [
    body('organizationName')
        .notEmpty()
        .withMessage('Organization Name is required')
        .bail()
        .isString()
        .withMessage('Organization Name must be a string'),

    body('from').notEmpty().withMessage('From date is required'),

    body('to').notEmpty().withMessage('To date is required'),
];

export const listCustomerStatementsValidators = [
    body('from').notEmpty().withMessage('From date is required'),

    body('to').notEmpty().withMessage('To date is required'),
];
