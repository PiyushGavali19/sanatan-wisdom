import mongoose from "mongoose";

const sharedChatSchema = new mongoose.Schema(
  {
    messages: Array,
  },
  { timestamps: true }
);

export default mongoose.model(
  "SharedChat",
  sharedChatSchema
);
