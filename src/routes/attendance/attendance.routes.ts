import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import {
    acceptRejectLeaveRequestControllers,
    clockInClockOutControllers,
    listClockInClockOutTimesControllers,
    listClockInClockOutTimesSuperAdminViewControllers,
    listLeaveRequestsControllers,
    listSubAdminAttendanceSheetControllers,
    listUserLeaveRequestsControllers,
    requestLeaveControllers,
} from './attendance.controllers';
import {
    acceptRejectLeaveRequestValidators,
    clockInClockOutValidators,
    listClockInClockOutTimesSuperAdminViewValidators,
    listLeaveRequestsValidators,
    listSubAdminAttendanceSheetValidators,
    listUserLeaveRequestsValidators,
    requestLeaveValidators,
} from './attendance.validators';

const router = express.Router();

router.post(
    '/admin/attendance/clockin/clockout',
    clockInClockOutValidators,
    isAdmin('Attendance', 'A'),
    clockInClockOutControllers,
);

router.get(
    '/admin/list/attendance/records',
    isAdmin('Attendance', 'V'),
    listClockInClockOutTimesControllers,
);

router.get(
    '/admin/list/:id/attendance/records',
    listClockInClockOutTimesSuperAdminViewValidators,
    isAdmin('Attendance', 'V'),
    listClockInClockOutTimesSuperAdminViewControllers,
);

router.post(
    '/admin/list/sub/admin/attendance',
    listSubAdminAttendanceSheetValidators,
    isAdmin('Attendance', 'V'),
    listSubAdminAttendanceSheetControllers,
);

router.post(
    '/admin/leave/request',
    requestLeaveValidators,
    isAdmin('Attendance', 'A'),
    requestLeaveControllers,
);

router.post(
    '/admin/leave/user/requests',
    listUserLeaveRequestsValidators,
    isAdmin('Attendance', 'V'),
    listUserLeaveRequestsControllers,
);

router.post(
    '/admin/leave/requests',
    listLeaveRequestsValidators,
    isAdmin('Attendance', 'V'),
    listLeaveRequestsControllers,
);

router.patch(
    '/admin/leave/:id/accept/reject/request',
    acceptRejectLeaveRequestValidators,
    isAdmin('Attendance', 'E'),
    acceptRejectLeaveRequestControllers,
);

export default router;
