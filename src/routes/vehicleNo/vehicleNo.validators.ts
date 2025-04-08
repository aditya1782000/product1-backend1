import { body, param } from 'express-validator';

export const vehicleNoValidators = [
    body('vehicleNo')
        .notEmpty()
        .withMessage('Vehicle No. is required')
        .bail()
        .matches(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/)
        .withMessage(
            'Please enter a valid Indian vehicle registration number (e.g., MH12AB1234)',
        ),
];

export const deleteVehicleNoValidators = [
    param('id')
        .notEmpty()
        .withMessage('id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid id'),
];
