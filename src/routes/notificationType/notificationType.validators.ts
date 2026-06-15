import { body, param } from 'express-validator';

export const notificationTypeValidators = [
    body('notificationType')
        .notEmpty()
        .withMessage('Notification Type is required')
        .bail()
        .isString()
        .withMessage('Notification Type must be a string')
        .bail()
        .isLength({ min: 1, max: 25 })
        .withMessage(
            'Notification Type must be bewteen 1 to 25 characters long',
        ),
];

export const deleteNotificationTypeValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
