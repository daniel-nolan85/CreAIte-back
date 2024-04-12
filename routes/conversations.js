import express from 'express';
import {
  fetchConversations,
  userConversation,
} from '../controllers/conversations.js';

const router = express.Router();

router.get('/fetch-conversations', fetchConversations);
router.get('/create-or-fetch-conversation/:userId', userConversation);

export default router;
