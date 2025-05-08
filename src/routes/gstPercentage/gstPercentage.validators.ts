import { body } from 'express-validator';

export const gstPercentageValidators = [
    body('gstPercentage')
        .notEmpty()
        .withMessage('Gst Percentage is required')
        .bail()
        .isNumeric()
        .withMessage('Gst Percentage must be number'),
];
