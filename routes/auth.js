import express from 'express';
import {
  createUser,
  loginUser,
  googleUser,
  currentUser,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/create-user', createUser);
router.post('/login-user', loginUser);
router.post('/google-user', googleUser);
router.post('/current-user', currentUser);

export default router;
