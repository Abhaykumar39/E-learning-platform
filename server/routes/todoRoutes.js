import express from "express";
import ToDo from "../models/todoModel.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const newTask = new ToDo(req.body);
  const saved = await newTask.save();
  res.json(saved);
});

router.get("/:userId", async (req, res) => {
  const tasks = await ToDo.find({ userId: req.params.userId });
  res.json(tasks);
});

router.put("/:id", async (req, res) => {
  const updated = await ToDo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await ToDo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
