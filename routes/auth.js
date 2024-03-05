import express from 'express';
import { createUser, loginUser, googleUser } from '../controllers/auth.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/login-user', loginUser);
router.post('/google-user', googleUser);

export default router;
