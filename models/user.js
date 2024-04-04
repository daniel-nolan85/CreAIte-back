import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: 'subscriber',
    },
    name: { type: String, text: true, required: true },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      text: true,
    },
    bio: { type: String, text: true, maxlength: 500 },
    lastLogin: { type: Date },
    profileImage: {
      url: String,
      public_id: String,
    },
    coverImage: {
      url: String,
      public_id: String,
    },
    subscription: {
      plan: { type: String, text: true, required: true },
      startDate: { type: Date },
      expiry: { type: Date },
      cost: String,
      imagesRemaining: Number,
      dalleVersion: String,
      gptVersion: String,
      customerSupport: String,
      subscriptionId: String,
      cancelled: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
