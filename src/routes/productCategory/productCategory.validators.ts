import { body, param } from 'express-validator';

export const createProductCategoryValidators = [
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .bail()
        .isString()
        .withMessage('Category must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage('Category must be at least 1 to 25 characters long'),
];

export const deleteProductCategoryValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
