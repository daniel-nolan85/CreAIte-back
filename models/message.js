import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String },
    sender: { type: ObjectId, ref: 'User' },
    content: { type: String },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
