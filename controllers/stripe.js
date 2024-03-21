import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSubscription = async (req, res) => {
  const { name, email, amount, paymentMethodId } = req.body;
  console.log({ name, email, amount, paymentMethodId });

  try {
    const customer = await stripe.customers.create({
      name,
      email,
      payment_method: paymentMethodId,
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    console.log({ customer });
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
    console.log({ subscription });
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

// export const createSubscription = async (req, res) => {
//   try {
//     const { name, email, paymentMethod, amount } = req.body;
//     const customer = await stripe.customers.create({
//       name,
//       email,
//       payment_method: paymentMethod,
//       invoice_settings: { default_payment_method: paymentMethod },
//     });
//     const product = await stripe.products.create({
//       name: 'Monthly subscription',
//     });
//     const subscription = await stripe.subscriptions.create({
//       customer: customer.id,
//       items: [
//         {
//           price_data: {
//             currency: 'USD',
//             product: product.id,
//             unit_amount: amount * 100,
//             recurring: {
//               interval: 'month',
//             },
//           },
//         },
//       ],
//       payment_settings: {
//         payment_method_types: ['card'],
//         save_default_payment_method: 'on_subscription',
//       },
//       expand: ['latest_invoice.payment_intent'],
//     });
//     res.json({
//       message: 'Subscription successful!',
//       clientSecret: subscription.latest_invoice.payment_intent.client_secret,
//       subscriptionId: subscription.id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
