import express from 'express';
import {
  createStripeSubscription,
  cancelStripeSubscription,
} from '../controllers/stripe.js';

const router = express.Router();

router.post('/create-stripe-subscription', createStripeSubscription);
router.post('/cancel-stripe-subscription', cancelStripeSubscription);

export default router;
