import express from 'express';
import { fetchData, fetchAllUsers } from '../controllers/admin.js';
import { authCheck, adminCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/fetch-data', authCheck, adminCheck, fetchData);
router.get('/fetch-users', authCheck, adminCheck, fetchAllUsers);

export default router;
