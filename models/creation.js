import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema;

const creationSchema = new mongoose.Schema(
  {
    createdBy: { type: ObjectId, ref: 'User', required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },
    imageSize: { type: String, required: true },
    caption: { type: String },
    keywords: { type: String },
    sharing: { type: Boolean, default: true },
    downloads: { type: Number, default: 0 },
    likes: [{ type: ObjectId, ref: 'User' }],
    model: { type: String },
  },
  { timestamps: true }
);

const Creation = mongoose.model('Creation', creationSchema);

export default Creation;
