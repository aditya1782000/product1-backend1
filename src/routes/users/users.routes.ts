import express from 'express';
import { addUsersControlller } from './users.controllers';
import { isAdmin } from '../../middleware/isAdmin';
import { addUsersValidators } from './users.validators';

const router = express.Router();

router.post(
    '/admin/users/add',
    addUsersValidators,
    isAdmin('', 'A'),
    addUsersControlller,
);

export default router;
