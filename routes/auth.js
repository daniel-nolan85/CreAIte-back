import express from 'express';
import {
  createUser,
  loginUser,
  googleUser,
  currentUser,
  currentAdmin,
  confirmUserEmail,
} from '../controllers/auth.js';
import { authCheck, adminCheck } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-user', authCheck, createUser);
router.post('/login-user', authCheck, loginUser);
router.post('/google-user', authCheck, googleUser);
router.post('/current-user', authCheck, currentUser);
router.post('/current-admin', authCheck, adminCheck, currentAdmin);
router.put('/confirm-user-email', authCheck, confirmUserEmail);

export default router;
