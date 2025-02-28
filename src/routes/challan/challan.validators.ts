import { body, param } from 'express-validator';

export const createChallanOrganizationValidators = [
    body('mobileNo')
        .notEmpty()
        .withMessage('Phone number is required')
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),

    body('footer')
        .notEmpty()
        .withMessage('Foter is required')
        .bail()
        .isString()
        .withMessage('footer must be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('footer  must between 3 to 50'),

    body('note')
        .notEmpty()
        .withMessage('Note is required')
        .bail()
        .isString()
        .withMessage('Footer must be a string')
        .isLength({ min: 3, max: 300 })
        .withMessage('Footer  must between 3 to 300'),
];

export const createChallanValidators = [
    body('customerName')
        .notEmpty()
        .withMessage('Customer name is required')
        .bail()
        .isString()
        .withMessage('Customer name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Customer name must between 3 to 100'),

    body('date').notEmpty().withMessage('Date is required'),

    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .bail()
        .isString()
        .withMessage('Address must be a string')
        .isLength({ min: 3, max: 300 })
        .withMessage('footer  must between 3 to 300'),

    body('items')
        .notEmpty()
        .withMessage('Items is required')
        .bail()
        .isArray()
        .withMessage('Items must be an array'),

    body('total')
        .notEmpty()
        .withMessage('Total is required')
        .bail()
        .isNumeric()
        .withMessage('Total must be a number'),
];

export const editChallanOrganizationValidators = [
    body('mobileNo')
        .optional()
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),

    body('footer')
        .optional()
        .bail()
        .isString()
        .withMessage('footer must be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('footer  must between 3 to 50'),

    body('note')
        .optional()
        .bail()
        .isString()
        .withMessage('Footer must be a string')
        .isLength({ min: 3, max: 300 })
        .withMessage('Footer  must between 3 to 300'),
];

export const deleteChallanOrganizationValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];

export const viewChallanValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];

export const editChallanValidators = [
    body('customerName')
        .optional()
        .bail()
        .isString()
        .withMessage('Customer name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Customer name must between 3 to 100'),

    body('date').notEmpty().withMessage('Date is required'),

    body('address')
        .optional()
        .bail()
        .isString()
        .withMessage('Address must be a string')
        .isLength({ min: 3, max: 300 })
        .withMessage('footer  must between 3 to 300'),

    body('items')
        .optional()
        .bail()
        .isArray()
        .withMessage('Items must be an array'),

    body('total')
        .optional()
        .bail()
        .isNumeric()
        .withMessage('Total must be a number'),
];

export const deleteChallanValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];

export const listChallansValidaors = [
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

export const listChallansOrganizationValidaors = [
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
