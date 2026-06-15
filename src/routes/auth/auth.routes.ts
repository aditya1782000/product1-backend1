import express from 'express';
import {
    customerLoginController,
    customerOptVerifyController,
    resendOtpControllers,
    resentVerifyCustomerOtpController,
    userChangePasswordController,
    userLoginController,
    userLogoutController,
    userPasswordReserPostController,
    userPasswordResetController,
    userPasswordResetGetController,
    verifyOtpControllers,
} from './auth.controllers';
import {
    resendOtpValidators,
    userChangePasswordValidator,
    userLoginValidator,
    userPasswordResetGetValidator,
    userPasswordResetPostValidator,
    userPasswordResetValidator,
    verifyOtpValidators,
} from './auth.validators';
import { validateOnlyAdmin } from '../../middleware/isOnlyAdmin';

const router = express.Router();

router.post('/admin/user/login', userLoginValidator, userLoginController);

router.post(
    '/admin/user/verify/otp',
    verifyOtpValidators,
    verifyOtpControllers,
);

router.post(
    '/admin/user/resend/otp',
    resendOtpValidators,
    resendOtpControllers,
);

router.post(
    '/admin/password/reset',
    userPasswordResetValidator,
    userPasswordResetController,
);

router.get(
    '/admin/password/:token/reset',
    userPasswordResetGetValidator,
    userPasswordResetGetController,
);

router.post(
    '/admin/password/:token/reset',
    userPasswordResetPostValidator,
    userPasswordReserPostController,
);

router.post('/admin/user/logout', validateOnlyAdmin(), userLogoutController);

router.post(
    '/admin/user/password/change',
    userChangePasswordValidator,
    validateOnlyAdmin(),
    userChangePasswordController,
);

router.post(
    '/customer/user/login',
    userLoginValidator,
    customerLoginController,
);

router.post(
    '/customer/user/verify/otp',
    verifyOtpValidators,
    customerOptVerifyController,
);

router.post(
    '/customer/user/resend/otp',
    resendOtpValidators,
    resentVerifyCustomerOtpController,
);

export default router;
