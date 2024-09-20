import express from 'express';
import { addUsersControlller, usersListControllers } from './users.controllers';
import { isAdmin } from '../../middleware/isAdmin';
import { addUsersValidators, usersListValidators } from './users.validators';

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

export default router;
