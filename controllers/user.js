import User from '../models/user.js';

export const fetchUser = async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findOne({
      _id,
    });
    res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const updateProfile = async (req, res) => {
  const { _id, name, bio } = req.body;
  try {
    const data = {};
    if (name) {
      data.name = name;
    }
    if (bio) {
      data.bio = bio;
    }
    const user = await User.findByIdAndUpdate(_id, data, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateProfileImage = async (req, res) => {
  const { _id, profileImage } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { profileImage: profileImage } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error('Error updating image:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCoverImage = async (req, res) => {
  const { _id, coverImage } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { coverImage: coverImage } },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error('Error updating image:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateSubscription = async (req, res) => {
  const { _id, amount, customOptions, subscriptionId } = req.body;
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const subscriptionUpdates = {
      'subscription.startDate': new Date(),
      'subscription.cost': (amount / 100).toFixed(2),
      'subscription.expiry': expiryDate,
      'subscription.subscriptionId': subscriptionId,
      'subscription.cancelled': false,
    };

    if (customOptions) {
      subscriptionUpdates['subscription.plan'] = 'custom';
      subscriptionUpdates['subscription.imagesRemaining'] =
        customOptions.numCreAItions;
      subscriptionUpdates['subscription.dalleVersion'] =
        customOptions.dallEVersion;
      subscriptionUpdates['subscription.gptVersion'] = customOptions.gptVersion;
      subscriptionUpdates['subscription.customerSupport'] =
        customOptions.customerSupport;
    } else {
      subscriptionUpdates['subscription.plan'] =
        amount === 1999 ? 'deluxe' : 'premium';
      subscriptionUpdates['subscription.imagesRemaining'] =
        amount === 1999 ? 100 : 200;
      subscriptionUpdates['subscription.dalleVersion'] = 'Dall-E-3';
      subscriptionUpdates['subscription.gptVersion'] =
        amount === 1999 ? 'GPT-3.5' : 'GPT-4 Turbo';
      subscriptionUpdates['subscription.customerSupport'] = 'Priority';
    }

    const user = await User.findByIdAndUpdate(
      _id,
      { $set: subscriptionUpdates },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.error('Error updating image:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
