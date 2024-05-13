import User from '../models/user.js';
import Creation from '../models/creation.js';
import admin from '../firebase/index.js';

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await new User({
      name,
      email,
      subscription: {
        plan: 'free',
        startDate: new Date(),
        cost: '0.00',
        imagesRemaining: 5,
        customerSupport: 'Standard',
        dalleVersion: 'Dall-E-2',
        gptVersion: 'GPT-3.5',
      },
    }).save();
    res.json(newUser);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const loginUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { lastLogin: new Date(Date.now()) },
      },
      { new: true }
    ).select(
      `_id name email lastLogin bio profileImage coverImage subscription role showCreAitionInstructions`
    );
    res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const googleUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    let user = await User.findOne({ email }).select(
      `_id name email lastLogin bio profileImage coverImage subscription role showCreAitionInstructions`
    );
    if (!user) {
      user = await new User({
        name,
        email,
        subscription: {
          plan: 'free',
          startDate: new Date(),
          cost: '0.00',
          imagesRemaining: 5,
          customerSupport: 'Standard',
          dalleVersion: 'Dall-E-2',
          gptVersion: 'GPT-3.5',
        },
      }).save();
    } else {
      user = await User.findOneAndUpdate(
        { email },
        {
          $set: { lastLogin: new Date(Date.now()) },
        },
        { new: true }
      ).select(
        `_id name email lastLogin bio profileImage coverImage subscription role showCreAitionInstructions`
      );
    }
    res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const currentUser = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const currentAdmin = async (req, res) => {
  const { email } = req.user;
  try {
    const user = await User.findOne({ email }).exec();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const confirmUserEmail = async (req, res) => {
  const { _id, email } = req.body;
  try {
    const user = await User.findOne({ _id, email });
    if (user) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, error: 'Email verification failed' });
    }
  } catch (error) {
    console.error('Error confirming email:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const checkUserExists = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: true });
    } else {
      return res.json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteAccount = async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findByIdAndDelete(_id).select('email');
    const creaitions = await Creation.updateMany(
      { createdBy: _id },
      { $set: { sharing: true } }
    );
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userRecord = await admin.auth().getUserByEmail(user.email);
    const uid = userRecord.uid;
    await admin.auth().deleteUser(uid);
    res.json(user);
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
