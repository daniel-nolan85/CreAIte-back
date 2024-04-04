import Stripe from 'stripe';
import User from '../models/user.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSubscription = async (req, res) => {
  const { _id, name, email, amount, paymentMethodId } = req.body;
  try {
    const user = await User.findById(_id);
    const existingSubscriptionId = user.subscription.subscriptionId;
    if (existingSubscriptionId) {
      await stripe.subscriptions.cancel(existingSubscriptionId);
    }

    const customer = await stripe.customers.create({
      name,
      email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    const product = await stripe.products.create({
      name: 'Monthly subscription',
    });
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: 'USD',
            product: product.id,
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
    res.json({
      message: 'Subscription successful!',
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      subscriptionId: subscription.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const cancelStripeSubscription = async (req, res) => {
  const { _id, subscriptionId } = req.body;
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    const user = await User.findById(_id);
    user.subscription.cancelled = true;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
