import User from '../models/user.js';

export const createUser = async (req, res) => {
  const { name, email } = req.body;
  console.log({ name });
  console.log({ email });
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
  console.log({ email });
  try {
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: { lastLogin: new Date(Date.now()) },
      },
      { new: true }
    ).select(`_id name email lastLogin bio profileImage coverImage`);
    console.log({ user });
    res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const googleUser = async (req, res) => {
  const { name, email } = req.body;
  console.log({ name });
  console.log({ email });
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
    console.log({ user });
    res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};
