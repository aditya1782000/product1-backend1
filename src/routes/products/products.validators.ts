import { body, param, query } from 'express-validator';
import enums from '../../../enum';

export const addProductValidators = [
    body('productName')
        .notEmpty()
        .withMessage('Product name is required')
        .bail()
        .isString()
        .withMessage('Product name must be string')
        .bail()
        .isLength({ min: 1, max: 100 })
        .withMessage('Product name must be between 1 to 100 characters'),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .bail()
        .isString()
        .withMessage('Description must be string')
        .bail()
        .isLength({ min: 1, max: 300 })
        .withMessage('Description must be between 1 to 100 characters'),

    body('howToUse')
        .notEmpty()
        .withMessage('How to use is required')
        .bail()
        .isString()
        .withMessage('How To Use must be string')
        .bail()
        .isLength({ min: 1, max: 300 })
        .withMessage('How to use name must be between 1 to 100 characters'),

    body('unitType').notEmpty().withMessage('Unit Type is required'),

    body('price')
        .isArray({ min: 1 })
        .withMessage('Price must be an array and cannot be empty'),

    body('price.*.area')
        .notEmpty()
        .withMessage('Area is required')
        .bail()
        .isString()
        .withMessage('area must be a string'),

    body('price.*.prices')
        .isArray({ min: 1 })
        .withMessage('Price must be an array and cannot be empty'),

    body('price.*.prices.*.quantityType')
        .notEmpty()
        .withMessage('Quantity Type IS required')
        .bail()
        .isString()
        .withMessage('Quantity Type Is required'),

    body('price.*.prices.*.price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be greater than zero'),
];

export const listProductsValidators = [
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

export const viewProductValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const toggleProductStatusValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const editProductValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),

    body('productName')
        .notEmpty()
        .withMessage('Product name is required')
        .bail()
        .isString()
        .withMessage('Product name must be string'),

    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .bail()
        .isString()
        .withMessage('Description must be string'),

    body('howToUse')
        .notEmpty()
        .withMessage('How to use is required')
        .bail()
        .isString()
        .withMessage('How To Use must be string'),

    body('unitType')
        .notEmpty()
        .withMessage('Unit Type is required')
        .bail()
        .isIn(enums.unitType)
        .withMessage('Invalid Unit Type'),

    //UnComment when integrate the React

    // body('price')
    //     .isArray({ min: 1 })
    //     .withMessage('Price must be an array and cannot be empty'),

    // body('price.*.area')
    //     .notEmpty()
    //     .withMessage('Area is required')
    //     .bail()
    //     .isString()
    //     .withMessage('area must be a string'),

    // body('price.*.prices')
    //     .isArray({ min: 1 })
    //     .withMessage('Price must be an array and cannot be empty'),

    // body('price.*.prices.*.quantityType')
    //     .notEmpty()
    //     .withMessage('Quantity Type IS required')
    //     .bail()
    //     .isString()
    //     .withMessage('Quantity Type Is required'),

    // body('price.*.prices.*.price')
    //     .isFloat({ gt: 0 })
    //     .withMessage('Price must be greater than zero'),
];

export const deleteProductValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const customerProductsListValidators = [
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

export const customerProductViewValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];
