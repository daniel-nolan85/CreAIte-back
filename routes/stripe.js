import express from 'express';
import { createStripeSubscription } from '../controllers/stripe.js';

const router = express.Router();

router.post('/create-stripe-subscription', createStripeSubscription);

export default router;
