import express from 'express';
import {
  createStripeSubscription,
  cancelStripeSubscription,
} from '../controllers/stripe.js';
import { authCheck } from '../middleware/auth.js';

const router = express.Router();

router.post('/create-stripe-subscription', authCheck, createStripeSubscription);
router.post('/cancel-stripe-subscription', authCheck, cancelStripeSubscription);

export default router;
