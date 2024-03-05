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
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
