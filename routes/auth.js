import express from 'express';
import { createOrUpdateUser } from '../controllers/auth.js';

const router = express.Router();

router.get('/create-or-update-user', createOrUpdateUser);

export default router;
