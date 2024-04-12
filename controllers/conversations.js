import Conversation from '../models/conversation.js';

const adminId = process.env.ADMIN_ID;

export const fetchConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({}).populate(
      'members',
      '_id name profileImage'
    );
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const userConversation = async (req, res) => {
  const { userId } = req.params;
  adminId;

  try {
    let conversation = await Conversation.findOne({
      members: { $all: [userId, adminId] },
    }).populate('members', '_id name profileImage');

    if (!conversation) {
      conversation = new Conversation({ members: [userId, adminId] });
      await conversation.save();
      await conversation.populate('members', '_id name profileImage');
    }

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
};
