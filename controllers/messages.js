import Message from '../models/message.js';
import User from '../models/user.js';

export const sendMessage = async (req, res) => {
  const { message } = req.body;
  const newMessage = new Message(message);
  try {
    const savedMessage = await newMessage.save();
    await savedMessage.populate('sender', '_id name profileImage');
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const conversationMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await Message.find({
      conversationId,
    }).populate('sender', '_id name profileImage');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const incrementNewMessages = async (req, res) => {
  const { receiverId } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      receiverId,
      { $inc: { newMessages: 1 } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const clearNewMessages = async (req, res) => {
  const { _id } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      _id,
      { $set: { newMessages: 0 } },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
