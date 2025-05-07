import { body, param } from 'express-validator';
import enums from '../../../enum';

export const addUsersValidators = [
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required')
        .bail()
        .isString()
        .withMessage('First name must be a string')
        .bail()
        .isLength({ min: 3, max: 25 }),

    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required')
        .bail()
        .isString()
        .withMessage('Last name must be a string')
        .bail()
        .isLength({ min: 3, max: 25 }),

    body('email')
        .trim()
        .if(body('role').not().equals('customer'))
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

                if (
                    body.addressLineOne.length < 3 ||
                    body.addressLineOne.length > 100
                ) {
                    throw new Error(
                        'Address 1 must between 3 to 100 characters',
                    );
                }

                if (!body.addressLineTwo) {
                    throw new Error('Address 2 is required');
                }

                if (typeof body.addressLineTwo !== 'string') {
                    throw new Error('Address 2 must be a string');
                }

                if (
                    body.addressLineTwo.length < 3 ||
                    body.addressLineTwo.length > 100
                ) {
                    throw new Error(
                        'Address 1 must between 3 to 100 characters',
                    );
                }

                if (!body.city) {
                    throw new Error('City is required');
                }

                if (typeof body.city !== 'string') {
                    throw new Error('City must be a string');
                }

                if (body.city.length < 3 || body.city.length > 25) {
                    throw new Error('State must be between 3 to 25 characters');
                }

                if (!body.state) {
                    throw new Error('State is required');
                }

                if (typeof body.state !== 'string') {
                    throw new Error('State must be a string');
                }

                if (body.state.length < 3 || body.state.length > 25) {
                    throw new Error('State must be between 3 to 25 characters');
                }

                if (!body.pinCode) {
                    throw new Error('Pin code is required');
                }

                if (typeof body.pinCode !== 'string') {
                    throw new Error('Pin code must be a number');
                }

                if (body.pinCode.length !== 6) {
                    throw new Error('Pin code must be a 6-digit number');
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
            if (!body.type) {
                throw new Error('Type is required');
            }

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

            if (
                body.addressLineOne.length < 3 ||
                body.addressLineOne.length > 100
            ) {
                throw new Error('Address 1 must between 3 to 100 characters');
            }

            if (!body.addressLineTwo) {
                throw new Error('Address 2 is required');
            }

            if (typeof body.addressLineTwo !== 'string') {
                throw new Error('Address 2 must be a string');
            }

            if (
                body.addressLineTwo.length < 3 ||
                body.addressLineTwo.length > 100
            ) {
                throw new Error('Address 1 must between 3 to 100 characters');
            }

            if (!body.city) {
                throw new Error('City is required');
            }

            if (typeof body.city !== 'string') {
                throw new Error('City must be a string');
            }

            if (body.city.length < 3 || body.city.length > 25) {
                throw new Error('State must be between 3 to 25 characters');
            }

            if (!body.state) {
                throw new Error('State is required');
            }

            if (typeof body.state !== 'string') {
                throw new Error('State must be a string');
            }

            if (body.state.length < 3 || body.state.length > 25) {
                throw new Error('State must be between 3 to 25 characters');
            }

            if (!body.pinCode) {
                throw new Error('Pin code is required');
            }

            if (typeof body.pinCode !== 'string') {
                throw new Error('Pin code must be a number');
            }

            if (body.pinCode.length !== 6) {
                throw new Error('Pin code must be a 6-digit number');
            }

            if (!body.orgnaizationName) {
                throw new Error('Organisation name is required');
            }

            if (typeof body.orgnaizationName !== 'string') {
                throw new Error('Organisation name must be a string');
            }

            if (
                body.orgnaizationName.length < 3 ||
                body.orgnaizationName.length > 100
            ) {
                throw new Error(
                    'Organisation name must be between 3 to 100 characters',
                );
            }

            if (body.gstNumber) {
                if (
                    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
                        body.gstNumber,
                    )
                ) {
                    throw new Error('Invalid GST number');
                }
            }
        }

        return true;
    }),
];

export const usersListValidators = [
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

    body('role')
        .notEmpty()
        .withMessage('Role is required')
        .bail()
        .isIn(enums.role)
        .withMessage('Invalid role type'),
];

export const userViewValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const userToggleStatusValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const userEditValidators = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),

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
        .if(body('role').not().equals('customer'))
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

                if (
                    body.addressLineOne.length < 3 ||
                    body.addressLineOne.length > 100
                ) {
                    throw new Error(
                        'Address 1 must between 3 to 100 characters',
                    );
                }

                if (!body.addressLineTwo) {
                    throw new Error('Address 2 is required');
                }

                if (typeof body.addressLineTwo !== 'string') {
                    throw new Error('Address 2 must be a string');
                }

                if (
                    body.addressLineTwo.length < 3 ||
                    body.addressLineTwo.length > 100
                ) {
                    throw new Error(
                        'Address 1 must between 3 to 100 characters',
                    );
                }

                if (!body.city) {
                    throw new Error('City is required');
                }

                if (typeof body.city !== 'string') {
                    throw new Error('City must be a string');
                }

                if (body.city.length < 3 || body.city.length > 25) {
                    throw new Error('State must be between 3 to 25 characters');
                }

                if (!body.state) {
                    throw new Error('State is required');
                }

                if (typeof body.state !== 'string') {
                    throw new Error('State must be a string');
                }

                if (body.state.length < 3 || body.state.length > 25) {
                    throw new Error('State must be between 3 to 25 characters');
                }

                if (!body.pinCode) {
                    throw new Error('Pin code is required');
                }

                if (typeof body.pinCode !== 'string') {
                    throw new Error('Pin code must be a number');
                }

                if (body.pinCode.length !== 6) {
                    throw new Error('Pin code must be a 6-digit number');
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
            if (!body.type) {
                throw new Error('Type is required');
            }

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

            if (
                body.addressLineOne.length < 3 ||
                body.addressLineOne.length > 100
            ) {
                throw new Error('Address 1 must between 3 to 100 characters');
            }

            if (typeof body.addressLineTwo !== 'string') {
                throw new Error('Address 2 must be a string');
            }

            if (
                body.addressLineTwo.length < 3 ||
                body.addressLineTwo.length > 100
            ) {
                throw new Error('Address 1 must between 3 to 100 characters');
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

            if (body.pinCode.length !== 6) {
                throw new Error('Pin code must be a 6-digit number');
            }

            if (!body.orgnaizationName) {
                throw new Error('Organisation name is required');
            }

            if (typeof body.orgnaizationName !== 'string') {
                throw new Error('Organisation name must be a string');
            }

            if (
                body.orgnaizationName.length < 3 ||
                body.orgnaizationName.length > 100
            ) {
                throw new Error(
                    'Organisation name must be between 3 to 100 characters',
                );
            }

            if (body.gstNumber) {
                if (
                    !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
                        body.gstNumber,
                    )
                ) {
                    throw new Error('Invalid GST number');
                }
            }
        }

        return true;
    }),
];

export const userDeleteValidator = [
    param('id')
        .notEmpty()
        .withMessage('Id is required')
        .bail()
        .isMongoId()
        .withMessage('Invalid Id'),
];

export const userProfileEditValidators = [
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
];
