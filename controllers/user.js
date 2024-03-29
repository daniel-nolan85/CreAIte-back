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
  const { _id, amount, subscriptionId } = req.body;
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      _id,
      {
        $set: {
          'subscription.plan': amount === 1499 ? 'deluxe' : 'premium',
          'subscription.startDate': new Date(),
          'subscription.cost': amount === 1499 ? '14.99' : '34.99',
          'subscription.imagesRemaining': amount === 1499 ? 100 : 200,
          'subscription.expiry': expiryDate,
          'subscription.subscriptionId': subscriptionId,
          'subscription.cancelled': false,
        },
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.error('Error updating image:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
