import express from 'express';
import { checkRecaptcha, sendUserEmail } from '../controllers/email.js';

const router = express.Router();

router.post('/recaptcha', checkRecaptcha);
router.post('/send-user-email', sendUserEmail);

export default router;
