import { body, param } from 'express-validator';
import enums from '../../../enum';

export const createCustomerOrderValidators = [
    body('orderItems')
        .isArray({ min: 1 })
        .withMessage('orderItems must be an array and cannot be empty'),

    body('orderItems.*.product')
        .notEmpty()
        .withMessage('Prodcut is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid product'),

    body('orderItems.*.quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .bail()
        .isNumeric()
        .withMessage('Qauntity must be a number'),

    body('orderItems.*.quantityType')
        .notEmpty()
        .withMessage('Quantity type is required')
        .bail()
        .isString()
        .withMessage('Invalid quantity type'),

    body('orderItems.*.unitPrice')
        .notEmpty()
        .withMessage('Unit price is required')
        .bail()
        .isNumeric()
        .withMessage('Unit price must be a number'),

    body('orderItems.*.totalPrice')
        .notEmpty()
        .withMessage('Total price is required')
        .bail()
        .isNumeric()
        .withMessage('Total price must be a number'),

    body('totalAmount')
        .notEmpty()
        .withMessage('Total amount is required')
        .bail()
        .isNumeric()
        .withMessage('Total amount must be a number'),

    body('status')
        .notEmpty()
        .withMessage('status is required')
        .bail()
        .isIn(enums.orderStatus)
        .withMessage('Invalid status'),
];

export const listPendingOrdersValidators = [
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
        .withMessage('Order array must contain object with column and dir key'),
];

export const listCompletedOrdersValidators = [
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

export const viewAdminOrderValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const viewCustomerOrderValidators = [
    param('body')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const editOrderValidators = [
    body('orderItems.*.product')
        .notEmpty()
        .withMessage('Prodcut is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid product'),

    body('orderItems.*.quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .bail()
        .isNumeric()
        .withMessage('Qauntity must be a number'),

    body('orderItems.*.quantityType')
        .notEmpty()
        .withMessage('Quantity type is required')
        .bail()
        .isString()
        .withMessage('Invalid quantity type'),

    body('orderItems.*.unitPrice')
        .notEmpty()
        .withMessage('Unit price is required')
        .bail()
        .isNumeric()
        .withMessage('Unit price must be a number'),

    body('orderItems.*.totalPrice')
        .notEmpty()
        .withMessage('Total price is required')
        .bail()
        .isNumeric()
        .withMessage('Total price must be a number'),

    body('totalAmount')
        .notEmpty()
        .withMessage('Total amount is required')
        .bail()
        .isNumeric()
        .withMessage('Total amount must be a number'),
];

export const acceptOrderValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const rejectOrderValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const changeOrderStatusValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const createAdminOrdersValidators = [
    body('orderItems')
        .isArray({ min: 1 })
        .withMessage('orderItems must be an array and cannot be empty'),

    body('orderItems.*.product')
        .notEmpty()
        .withMessage('Prodcut is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid product'),

    body('orderItems.*.quantity')
        .notEmpty()
        .withMessage('Product quantity is required')
        .bail()
        .isNumeric()
        .withMessage('Qauntity must be a number'),

    body('orderItems.*.quantityType')
        .notEmpty()
        .withMessage('Quantity type is required')
        .bail()
        .isString()
        .withMessage('Invalid quantity type'),

    body('orderItems.*.unitPrice')
        .notEmpty()
        .withMessage('Unit price is required')
        .bail()
        .isNumeric()
        .withMessage('Unit price must be a number'),

    body('orderItems.*.totalPrice')
        .notEmpty()
        .withMessage('Total price is required')
        .bail()
        .isNumeric()
        .withMessage('Total price must be a number'),

    body('totalAmount')
        .notEmpty()
        .withMessage('Total amount is required')
        .bail()
        .isNumeric()
        .withMessage('Total amount must be a number'),

    body('status')
        .optional()
        .bail()
        .isIn(enums.orderStatus)
        .withMessage('Invalid status'),

    body('type')
        .optional()
        .bail()
        .isIn(enums.orderType)
        .withMessage('Invalid order type'),
];

export const deleteOrderValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];
