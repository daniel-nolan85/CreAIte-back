import express from 'express';
import {
  sendMessage,
  conversationMessages,
  incrementNewMessages,
  clearNewMessages,
} from '../controllers/messages.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.post('/send-message', authCheck, sendMessage);
router.get('/fetch-messages/:conversationId', authCheck, conversationMessages);
router.post('/increment-new-messages', incrementNewMessages);
router.put('/clear-new-messages', clearNewMessages);

export default router;
