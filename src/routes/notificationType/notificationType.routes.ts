import express from 'express';
import {
    deleteNotificationTypeValidators,
    notificationTypeValidators,
} from './notificationType.validators';
import { isAdmin } from '../../middleware/isAdmin';
import {
    createNotificationTypeControllers,
    deleteNotificationControllers,
    listNotificationControllers,
} from './notificationType.controllers';

const router = express.Router();

router.post(
    '/admin/create/notification/type',
    notificationTypeValidators,
    isAdmin('Notification', 'A'),
    createNotificationTypeControllers,
);

router.get(
    '/admin/notification/type/list',
    isAdmin('Notification', 'A'),
    listNotificationControllers,
);

router.get(
    '/admin/notification/type/:id/delete',
    deleteNotificationTypeValidators,
    isAdmin('Notification', 'A'),
    deleteNotificationControllers,
);

export default router;
