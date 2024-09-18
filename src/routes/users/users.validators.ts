import { body } from 'express-validator';
import enums from '../../../enum';

export const addUsersValidators = [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .bail()
        .isString()
        .withMessage('First name must be a string')
        .bail()
        .isLength({ min: 3, max: 25 }),

    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .bail()
        .isString()
        .withMessage('Last name must be a string')
        .bail()
        .isLength({ min: 3, max: 25 }),

    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .bail()
        .isEmail()
        .withMessage('Please enter a valid email'),

    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .bail()
        .isIn(enums.role)
        .withMessage('Invalid role'),

    body().custom((body) => {
        if (body.role === 'subAdmin') {
            const permissions = body.permissions;

            if (!permissions || !Array.isArray(permissions)) {
                throw new Error('Permissions must be an array');
            }

            permissions.forEach((permission) => {
                if (
                    !permission.hasOwnProperty('eKey') ||
                    !permission.hasOwnProperty('eType')
                ) {
                    throw new Error('Each permission must have eKey and eType');
                }
                let isValidType;

                if (Array.isArray(permission.eType)) {
                    isValidType = permission.eType.every(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (type: any) => enums.permissionType.includes(type),
                    );
                } else {
                    isValidType = enums.permissionType.includes(
                        permission.eType,
                    );
                }

                if (!isValidType) {
                    throw new Error('Invalid permission type');
                }
            });

            return permissions;
        } else if (body.role === 'employee') {
            if (!body.phoneNumber) {
                throw new Error('Phone number is required');
            }

            if (typeof body.phoneNumber !== 'string') {
                throw new Error('Phone number must be a string');
            }

            if (!/^\+91\d{10}$/.test(body.phoneNumber)) {
                throw new Error('Invalid phone number');
            }
        } else if (body.role === 'customer') {
            if (!body.phoneNumber) {
                throw new Error('Phone number is required');
            }

            if (typeof body.phoneNumber !== 'string') {
                throw new Error('Phone number must be a string');
            }

            if (!/^\+91\d{10}$/.test(body.phoneNumber)) {
                throw new Error('Invalid phone number');
            }

            if (!body.addressLineOne) {
                throw new Error('Address 1 is required');
            }

            if (typeof body.addressLineOne !== 'string') {
                throw new Error('Address 1 must be a string');
            }

            if (!body.addressLineTwo) {
                throw new Error('Address 1 is required');
            }

            if (typeof body.addressLineTwo !== 'string') {
                throw new Error('Address 2 must be a string');
            }

            if (!body.city) {
                throw new Error('City is required');
            }

            if (typeof body.city !== 'string') {
                throw new Error('City must be a string');
            }

            if (!body.state) {
                throw new Error('State is required');
            }

            if (typeof body.state !== 'string') {
                throw new Error('State must be a string');
            }

            if (!body.pinCode) {
                throw new Error('Pin code is required');
            }

            if (typeof body.pinCode !== 'string') {
                throw new Error('Pin code must be a number');
            }
        }

        return true;
    }),
];
