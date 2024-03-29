import express from 'express';
import { sendMessage, conversationMessages } from '../controllers/messages.js';

const router = express.Router();

router.post('/send-message', sendMessage);
router.get('/fetch-messages/:conversationId', conversationMessages);

export default router;
