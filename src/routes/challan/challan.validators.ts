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

    body('customerMobileNo')
        .optional()
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),

    body('vehicleNo')
        .optional()
        .bail()
        .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
        .withMessage(
            'Please enter a valid Indian vehicle registration number (e.g., MH12AB1234)',
        ),
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

    body('customerMobileNo')
        .optional()
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),

    body('vehicleNo')
        .optional()
        .bail()
        .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
        .withMessage(
            'Please enter a valid Indian vehicle registration number (e.g., MH12AB1234)',
        ),
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

export const createCustomChallanOrganizationValidators = [
    body('challanOrg')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .bail()
        .isString()
        .withMessage('Organization name must be a string')
        .bail()
        .isLength({ min: 3, max: 40 })
        .withMessage(
            'Organization name must be between 3 to 40 characters long',
        ),

    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .bail()
        .isString()
        .withMessage('Titlee must be a string')
        .bail()
        .isLength({ min: 3, max: 40 })
        .withMessage('Title must be between 3 to 40 characters long'),

    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .bail()
        .isString()
        .withMessage('Address must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Address must be between 3 to 200 characters long'),

    body('gstNo')
        .trim()
        .notEmpty()
        .withMessage('GST Number is required')
        .bail()
        .isString()
        .withMessage('GST Number must be a string')
        .bail()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .withMessage('Invalid GST Number'),

    body('panNo')
        .trim()
        .notEmpty()
        .withMessage('Pan No is required')
        .bail()
        .isString()
        .withMessage('Pan No must be a string')
        .bail()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}/)
        .withMessage('Invalid Pan Number'),

    body('headerContent')
        .trim()
        .notEmpty()
        .withMessage('Header content is required')
        .bail()
        .isString()
        .withMessage('Header content is required')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Header content must be between 3 to 200 characters long'),

    body('footerOne')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer one must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer one must be between 3 to 200 characters long'),

    body('footerTwo')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer two must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer two must be between 3 to 200 characters long'),

    body('footerThree')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer three must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer three must be between 3 to 200 characters long'),

    body('footerFour')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer four must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer four must be between 3 to 200 characters long'),

    body('footerFive')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer five must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer five must be between 3 to 200 characters long'),
];

export const editCustomChallanOrganizationValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),

    body('challanOrg')
        .trim()
        .optional()
        .bail()
        .isString()
        .withMessage('Organization name must be a string')
        .bail()
        .isLength({ min: 3, max: 40 })
        .withMessage(
            'Organization name must be between 3 to 40 characters long',
        ),

    body('title')
        .trim()
        .optional()
        .bail()
        .isString()
        .withMessage('Titlee must be a string')
        .bail()
        .isLength({ min: 3, max: 40 })
        .withMessage('Title must be between 3 to 40 characters long'),

    body('address')
        .trim()
        .optional()
        .bail()
        .isString()
        .withMessage('Address must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Address must be between 3 to 200 characters long'),

    body('gstNo')
        .trim()
        .optional()
        .bail()
        .isString()
        .withMessage('GST Number must be a string')
        .bail()
        .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
        .withMessage('Invalid GST Number'),

    body('panNo')
        .trim()
        .optional()
        .bail()
        .isString()
        .withMessage('Pan No must be a string')
        .bail()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}/)
        .withMessage('Invalid Pan Number'),

    body('headerContent')
        .trim()
        .optional()
        .bail()
        .isString()
        .withMessage('Header content is required')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Header content must be between 3 to 200 characters long'),

    body('footerOne')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer one must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer one must be between 3 to 200 characters long'),

    body('footerTwo')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer two must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer two must be between 3 to 200 characters long'),

    body('footerThree')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer three must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer three must be between 3 to 200 characters long'),

    body('footerFour')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer four must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer four must be between 3 to 200 characters long'),

    body('footerFive')
        .trim()
        .optional()
        .isString()
        .withMessage('Footer five must be a string')
        .bail()
        .isLength({ min: 3, max: 200 })
        .withMessage('Footer five must be between 3 to 200 characters long'),
];

export const deleteCustomChallanOrganizationValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const viewCustomChallanValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const deleteCustomChallanValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const listCustomChallanOrgValidators = [
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

export const listCustomChallanValidators = [
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

export const createCustomChallanValidators = [
    body('customerName')
        .notEmpty()
        .withMessage('Customer name is required')
        .bail()
        .isString()
        .withMessage('Customer name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Customer name must between 3 to 100'),

    body('date').notEmpty().withMessage('Date is required'),

    body('dated').notEmpty().withMessage('Date is required'),

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

    body('customerMobileNo')
        .optional()
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),

    body('vehicleNo')
        .optional()
        .bail()
        .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
        .withMessage(
            'Please enter a valid Indian vehicle registration number (e.g., MH12AB1234)',
        ),

    body('partyCode')
        .optional()
        .isString()
        .withMessage('Party Code must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Party Code must be 3 to 100 characters long'),

    body('nameOfTransport')
        .optional()
        .isString()
        .withMessage('Name of Transport must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Name of Transport must be 3 to 100 characters long'),

    body('lrNo')
        .optional()
        .isString()
        .withMessage('Lr No must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Lr No must be 3 to 100 characters long'),

    body('orderNo')
        .optional()
        .isString()
        .withMessage('Order No must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Order No must be 3 to 100 characters long'),
];

export const editCustomChallanValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),

    body('customerName')
        .optional()
        .bail()
        .isString()
        .withMessage('Customer name must be a string')
        .isLength({ min: 3, max: 100 })
        .withMessage('Customer name must between 3 to 100'),

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

    body('customerMobileNo')
        .optional()
        .bail()
        .isNumeric()
        .matches(/^\+91\d{10}$/)
        .withMessage('Phone number must be 10 digit'),

    body('vehicleNo')
        .optional()
        .bail()
        .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
        .withMessage(
            'Please enter a valid Indian vehicle registration number (e.g., MH12AB1234)',
        ),

    body('partyCode')
        .optional()
        .isString()
        .withMessage('Party Code must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Party Code must be 3 to 100 characters long'),

    body('nameOfTransport')
        .optional()
        .isString()
        .withMessage('Name of Transport must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Name of Transport must be 3 to 100 characters long'),

    body('lrNo')
        .optional()
        .isString()
        .withMessage('Lr No must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Lr No must be 3 to 100 characters long'),

    body('orderNo')
        .optional()
        .isString()
        .withMessage('Order No must be a string')
        .bail()
        .isLength({ min: 3, max: 100 })
        .withMessage('Order No must be 3 to 100 characters long'),
];
