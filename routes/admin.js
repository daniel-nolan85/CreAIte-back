import express from 'express';
import { fetchData, fetchAllUsers } from '../controllers/admin.js';

const router = express.Router();

router.get('/fetch-data', fetchData);
router.get('/fetch-users', fetchAllUsers);

export default router;
