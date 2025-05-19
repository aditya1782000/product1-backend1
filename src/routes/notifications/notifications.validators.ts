import { body, param, query } from 'express-validator';

export const sendNotificationsValidators = [
    body('customers')
        .notEmpty()
        .withMessage('Customer is Required')
        .bail()
        .isArray()
        .withMessage('Cusotmer must be valid array'),
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isString()
        .withMessage('Title must be a string')
        .bail()
        .isLength({ min: 3, max: 25 })
        .withMessage('Title must be between 3 and 25 characters'),
    body('body')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isString()
        .withMessage('Title must be a string')
        .bail()
        .isLength({ min: 3, max: 25 })
        .withMessage('Title must be between 3 and 25 characters'),
    body('type')
        .notEmpty()
        .withMessage('Type is required')
        .bail()
        .isString()
        .withMessage('Type must be a string'),
];

export const customerNotificationListValidators = [
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

export const markAsReadValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Id must be valid mongo id'),
];
