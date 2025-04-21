import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  day: String,
  time: String,
  repeat: String,
  room: String,
  teachers: String,
  note: String,
  color: { type: String, default: "#ffffff" }, // Added color field with a default color
});

export const Timetable = mongoose.model("Timetable", timetableSchema);
