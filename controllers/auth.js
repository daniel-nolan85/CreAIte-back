import User from '../models/user.js';

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await new User({
      name,
      email,
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
    ).select(`_id name email lastLogin bio profileImage coverImage`);
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
      `_id name email lastLogin bio profileImage coverImage`
    );
    if (!user) {
      user = await new User({
        name,
        email,
      }).save();
    } else {
      user = await User.findOneAndUpdate(
        { email },
        {
          $set: { lastLogin: new Date(Date.now()) },
        },
        { new: true }
      ).select(`_id name email lastLogin bio profileImage coverImage`);
    }
    res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const currentUser = async (req, res) => {
  console.log('currentUser =>', req.body);
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
