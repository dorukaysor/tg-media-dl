import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  isPremium: { type: Boolean, default: false },
  hasPaid: { type: Boolean, default: false },
  dailyDownloadCount: { type: Number, default: 0 },
  nsfwEnabled: { type: Boolean, default: false },
  lastReset: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);