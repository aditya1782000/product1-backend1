import express from 'express';
import {
    addUsersControlller,
    usersListControllers,
    userViewController,
} from './users.controllers';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addUsersValidators,
    usersListValidators,
    userViewValidators,
} from './users.validators';

const router = express.Router();

router.post(
    '/admin/users/add',
    addUsersValidators,
    isAdmin('', 'A'),
    addUsersControlller,
);

router.get(
    '/admin/users/list',
    usersListValidators,
    isAdmin('', 'V'),
    usersListControllers,
);

router.get(
    '/admin/user/:id/view',
    userViewValidators,
    isAdmin('', 'V'),
    userViewController,
);

export default router;
