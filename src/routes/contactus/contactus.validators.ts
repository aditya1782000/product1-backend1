import { body, param } from 'express-validator';

export const addContactUsValidators = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .bail()
        .isString()
        .withMessage('Name must be a string')
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters'),
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Email is invalid'),
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),
    body('message')
        .notEmpty()
        .withMessage('Message is required')
        .bail()
        .isString()
        .withMessage('Message must be a string')
        .bail()
        .isLength({ min: 5, max: 500 })
        .withMessage('Message must be between 5 and 500 characters'),
];

export const listContactUsValidators = [
    body('start')
        .notEmpty()
        .withMessage('Datatable offset is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid offset value'),

    body('length')
        .notEmpty()
        .withMessage('Datatable limit is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid limit value'),

    body('draw')
        .notEmpty()
        .withMessage('Datatable draw is required')
        .bail()
        .isNumeric()
        .withMessage('Invalid draw value'),

    body('search')
        .notEmpty()
        .notEmpty()
        .withMessage('Search is required')
        .bail()
        .isObject()
        .withMessage('Search must be an object')
        .bail()
        .custom((value) => value.hasOwnProperty('value'))
        .withMessage('Search object must contain a value key'),

    body('columns')
        .notEmpty()
        .withMessage('Columns is required')
        .bail()
        .isArray()
        .withMessage('Columns must contain an array')
        .bail()
        .custom((value) => value[0].hasOwnProperty('data'))
        .withMessage('Column array must conatin object wiht data key'),

    body('order')
        .notEmpty()
        .withMessage('Order key is required')
        .bail()
        .isArray()
        .withMessage('Order key must contain an array')
        .bail()
        .custom((value) => {
            const [firstOrder] = value;
            return (
                firstOrder.hasOwnProperty('column') &&
                firstOrder.hasOwnProperty('dir')
            );
        })
        .withMessage('Order arrat must contain object with column and dir key'),
];

export const deleteContactUsValidators = [
    param('id')
        .notEmpty()
        .withMessage('Contact Us ID is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];

export const resolveContactUsValidators = [
    param('id')
        .notEmpty()
        .withMessage('Contact Us ID is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
