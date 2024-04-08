import Stripe from 'stripe';
import User from '../models/user.js';
import Creation from '../models/creation.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const fetchData = async (req, res) => {
  try {
    const users = await User.countDocuments({});
    const creations = await Creation.countDocuments({});
    const transactions = await stripe.balanceTransactions.list({});
    console.log({ transactions });
    res.status(200).json({ users, creations, transactions });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};
