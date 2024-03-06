import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const creationSchema = new mongoose.Schema(
  {
    createdBy: { type: ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },
  },
  { timestamps: true }
);

const Creation = mongoose.model('Creation', creationSchema);

export default Creation;
