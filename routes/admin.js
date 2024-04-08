import express from 'express';
import { fetchData } from '../controllers/admin.js';

const router = express.Router();

router.get('/fetch-data', fetchData);

export default router;
