import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    status: { type: Boolean, default: false }, // false = pending
    dueAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
