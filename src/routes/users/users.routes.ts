import express from 'express';
import {
    addUsersControlller,
    userDeleteController,
    userEditController,
    userPermissionsController,
    userProfileController,
    userProfileUpdateController,
    usersListControllers,
    userToggleStatusController,
    userViewController,
} from './users.controllers';
import { isAdmin } from '../../middleware/isAdmin';
import {
    addUsersValidators,
    userDeleteValidator,
    userEditValidators,
    userProfileEditValidators,
    usersListValidators,
    userToggleStatusValidators,
    userViewValidators,
} from './users.validators';
import { validateOnlyAdmin } from '../../middleware/isOnlyAdmin';

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

router.patch(
    '/admin/user/:id/toggle',
    userToggleStatusValidators,
    isAdmin('', 'AD'),
    userToggleStatusController,
);

router.patch(
    '/admin/user/:id/edit',
    userEditValidators,
    isAdmin('', 'E'),
    userEditController,
);

router.delete(
    '/admin/user/:id/delete',
    userDeleteValidator,
    isAdmin('', 'D'),
    userDeleteController,
);

router.get('/admin/users/permissions', isAdmin(), userPermissionsController);

// Profile Routes
router.get('/admin/profile', validateOnlyAdmin(), userProfileController);

router.patch(
    '/admin/profile/edit',
    userProfileEditValidators,
    validateOnlyAdmin(),
    userProfileUpdateController,
);

export default router;
