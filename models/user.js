import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
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
    subscription: {},
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
