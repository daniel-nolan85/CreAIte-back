import express from 'express';
import {
  //   conversation,
  fetchConversations,
  userConversation,
} from '../controllers/conversations.js';

const router = express.Router();

// router.post('/conversation', conversation);
router.get('/fetch-conversations', fetchConversations);
router.get('/create-or-fetch-conversation/:userId', userConversation);

export default router;
