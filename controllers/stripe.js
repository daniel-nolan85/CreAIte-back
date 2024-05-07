import Stripe from 'stripe';
import User from '../models/user.js';
import nodemailer from 'nodemailer';
import moment from 'moment';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSubscription = async (req, res) => {
  const { _id, name, email, amount, paymentMethodId } = req.body;
  try {
    const user = await User.findById(_id);
    const existingSubscriptionId = user.subscription.subscriptionId;
    if (existingSubscriptionId && !user.subscription.cancelled) {
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

    const transporter = nodemailer.createTransport({
      host: 'smtp.dreamhost.com',
      port: 465,
      secure: true,
      auth: {
        user: 'support@creaite.media',
        pass: process.env.DREAMHOST_AUTHORIZATION,
      },
    });

    const mailOptions = {
      from: 'support@creaite.media',
      to: user.email,
      subject: 'Confirmation: Your Subscription to CreAIte has been Cancelled',
      html: `
       <p>Dear ${user.name},</p>
       <p>We're reaching out to confirm that your ${
         user.subscription.plan.charAt(0).toUpperCase() +
         user.subscription.plan.slice(1)
       } Subscription to CreAIte has been successfully cancelled. We understand your decision and want to assure you that you will continue to have access to your subscription benefits until the end of your current billing period, which is until ${moment(
        user.subscription.expiry
      ).format('ddd, MMMM Do YYYY')}.</p>
       <p>If you have any questions or need assistance during this transition period, please don't hesitate to contact our support team. We're here to help and want to ensure a smooth experience for you.</p>
       <p>Thank you for being a part of our community. We hope to see you again in the future!</p>
       <p>Best regards,</p>
       <p>Daniel Nolan</p>
       <p>Founder & CEO, CreAIte Media</p>
       `,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        res.status(500).send('Error sending email');
      } else {
        res.json(user);
      }
    });

    transporter.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
