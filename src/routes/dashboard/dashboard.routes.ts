import express from 'express';
import { isAdmin } from '../../middleware/isAdmin';
import { getCountDataControllers } from './dashboard.controllers';

const router = express.Router();

router.get('/admin/dashboard/count/data', isAdmin(), getCountDataControllers);

export default router;
