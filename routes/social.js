import express from 'express';
import { facebookLoginHandler } from '../controllers/social.js';

const router = express.Router();

router.get('/facebook-login-handler/:facebooktoken', facebookLoginHandler);

export default router;
