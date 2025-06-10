import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fileId: String,
  filePath: String,
  createdAt: { type: Date, default: Date.now },
});

mediaSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

export default mongoose.model("Media", mediaSchema);