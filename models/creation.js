import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },
  },
  { timestamps: true }
);

const Creation = mongoose.model('Creation', creationSchema);

export default Creation;
