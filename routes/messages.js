import express from 'express';
import { sendMessage, conversationMessages } from '../controllers/messages.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-message', authCheck, sendMessage);
router.get('/fetch-messages/:conversationId', authCheck, conversationMessages);

export default router;
