import Message from '../models/message.js';

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
