import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  userId: String,
  task: String,
  completed: { type: Boolean, default: false },
  dueDate: Date,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
});

export default mongoose.model("ToDo", todoSchema);
