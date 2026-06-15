import { query } from 'express-validator';

export const searchCusotmerProductList = [
    query('keyword')
        .notEmpty()
        .withMessage('Keyword is Required')
        .bail()
        .isString()
        .withMessage('Keyword must be a string'),
    query('start')
        .notEmpty()
        .withMessage('Offset is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid offset value'),

    query('length')
        .notEmpty()
        .withMessage('Limit is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid limit value'),
];
