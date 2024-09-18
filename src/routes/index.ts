import express from 'express';
import registration from './registration/registration.routes';
import auth from './auth/auth.routes';
import users from './users/users.routes';

const router = express.Router();

router.use('/', [registration, auth, users]);

export default router;
