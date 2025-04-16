import { body, param } from 'express-validator';

export const createTypeofPackingValidators = [
    body('typeOfPacking')
        .notEmpty()
        .withMessage('Unit Type is required')
        .bail()
        .isString()
        .withMessage('Unit Type must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage('Unit Type must be at least 1 to 25 characters long'),
];

export const deleteTypeOfPackingValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
