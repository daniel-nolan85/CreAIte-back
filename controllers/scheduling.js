import User from '../models/user.js';

export const updateSubscriptions = async (req, res) => {
  try {
    const users = await User.find({
      'subscription.expiry': { $lte: new Date() },
    });

    for (const user of users) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        user.subscription.subscriptionId
      );

      if (paymentIntent.status === 'succeeded') {
        const expiryDate = new Date(user.subscription.expiry);
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        user.subscription.imagesRemaining = 100;

        await user.save();

        // Optionally, notify the user about the subscription renewal
        // Send email or push notification
      } else {
        console.error('Payment failed for user:', user._id);
        // Log the error, notify the user, or take other actions as needed
      }
    }
    console.log('Subscription renewal task completed successfully.');
  } catch (error) {
    console.error('Error renewing subscriptions:', error);
  }
};
