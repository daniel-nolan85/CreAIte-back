import Stripe from 'stripe';
import User from '../models/user.js';
import Creation from '../models/creation.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const fetchData = async (req, res) => {
  try {
    const usersByMonth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const creationsByMonth = await Creation.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const users = await User.countDocuments({});
    const creations = await Creation.countDocuments({});
    const paymentData = {};
    let hasMore = true;
    let endingBefore;

    while (hasMore) {
      const transactions = await stripe.balanceTransactions.list({
        limit: 100,
        ending_before: endingBefore,
      });
      transactions.data.forEach((transaction) => {
        const transactionDate = new Date(transaction.created * 1000);
        const year = transactionDate.getFullYear();
        const month = transactionDate.toLocaleString('default', {
          month: 'long',
        });
        const paymentDetails = {
          id: transaction.id,
          amount: transaction.amount / 100,
          description: transaction.description,
          status: transaction.status,
          created: transactionDate,
          fee: transaction.fee / 100,
          net: transaction.net / 100,
          type: transaction.type,
          currency: transaction.currency,
        };
        if (!paymentData[year]) {
          paymentData[year] = {};
        }
        if (!paymentData[year][month]) {
          paymentData[year][month] = [];
        }
        paymentData[year][month].push(paymentDetails);
      });

      if (transactions.data.length < 100) {
        hasMore = false;
      } else {
        endingBefore = transactions.data[transactions.data.length - 1].id;
      }
    }
    res.status(200).json({
      users,
      usersByMonth,
      creations,
      creationsByMonth,
      paymentData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};

export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select(
      '_id name profileImage email createdAt lastLogin subscription likes downloads'
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send(error?.response.data.error.message);
  }
};
