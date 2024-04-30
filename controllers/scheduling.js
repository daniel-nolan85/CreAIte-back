import Stripe from 'stripe';
import User from '../models/user.js';

export const updateSubscriptions = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    const users = await User.find({
      'subscription.expiry': { $lte: new Date() },
    });
    for (const user of users) {
      const subscription = await stripe.subscriptions.retrieve(
        user.subscription.subscriptionId
      );
      if (subscription.status === 'active') {
        const expiryDate = new Date(user.subscription.expiry);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        user.subscription.expiry = expiryDate;
        user.subscription.imagesRemaining = user.monthlyAllocation;
        await user.save();
      } else {
        console.error('User has cancelled their subscription', user._id);
      }
    }
    console.log('Subscription renewal task completed successfully.');
  } catch (error) {
    console.error('Error renewing subscriptions:', error);
  }
};
