import express from 'express';
import { registerUserControllers } from './registration.controllers';
import { registerUserValidators } from './registration.validators';

const router = express.Router();

router.post('/register/user', registerUserValidators, registerUserControllers);

export default router;
