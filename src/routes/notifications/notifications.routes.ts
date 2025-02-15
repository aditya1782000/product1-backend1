import express from 'express';
import {
    customerNotificationsListControllers,
    markAllAsReadControllers,
    markAsReadControllers,
    sendNotificationControllers,
} from './notifications.controllers';
import uploader from '../../utils/uploader';
import { isAdmin } from '../../middleware/isAdmin';
import {
    customerNotificationListValidators,
    markAsReadValidators,
    sendNotificationsValidators,
} from './notifications.validators';
import { isCustomer } from '../../middleware/isCustomer';

const router = express.Router();

// Admin APIs
router.post(
    '/admin/send/notifications',
    uploader.uploadFile('image'),
    sendNotificationsValidators,
    isAdmin('notifications', 'A'),
    sendNotificationControllers,
);

// Customers APIs
router.get(
    '/customer/notification/list',
    customerNotificationListValidators,
    isCustomer(),
    customerNotificationsListControllers,
);

router.patch(
    '/customer/notification/:id/mark/as/read',
    markAsReadValidators,
    isCustomer(),
    markAsReadControllers,
);

router.patch(
    '/customer/notification/mark/all/as/read',
    isCustomer(),
    markAllAsReadControllers,
);

export default router;
