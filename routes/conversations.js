import express from 'express';
import {
  fetchConversations,
  userConversation,
} from '../controllers/conversations.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.get('/fetch-conversations', authCheck, fetchConversations);
router.get(
  '/create-or-fetch-conversation/:userId',
  authCheck,
  userConversation
);

export default router;
