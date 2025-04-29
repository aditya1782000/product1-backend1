import { body, param } from 'express-validator';

export const createTypeofPackingValidators = [
    body('typeOfPacking')
        .notEmpty()
        .withMessage('Type of Packing is required')
        .bail()
        .isString()
        .withMessage('Type of Packing must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage(
            'Type of Packing must be at least 1 to 25 characters long',
        ),
];

export const deleteTypeOfPackingValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
