import { body } from 'express-validator';
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
        .isIn(enums.unitType)
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

    body('type')
        .notEmpty()
        .withMessage('Order type is required')
        .bail()
        .isIn(enums.orderType)
        .withMessage('Invalid order type'),
];
