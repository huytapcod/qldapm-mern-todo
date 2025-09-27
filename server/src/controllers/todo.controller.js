import Todo from "../models/todo.model.js";
import mongoose from "mongoose";

export const createTodo = async (req, res) => {
  try {
    const { title, dueAt } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const todo = await Todo.create({ title, dueAt });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodos = async (req, res) => {
  try {
    const { status, from, to, page = 1, limit = 5, q } = req.query;
    const query = {};

    if (status !== undefined) query.status = status === "true";
    if (q) query.title = { $regex: q, $options: "i" };
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const pageNum = Math.max(1, Number(page));
    const perPage = Math.max(1, Number(limit));

    const [data, total] = await Promise.all([
      Todo.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * perPage)
        .limit(perPage),
      Todo.countDocuments(query),
    ]);

    res.json({ data, total, page: pageNum, pages: Math.ceil(total / perPage) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });
    const updated = await Todo.findByIdAndUpdate(id, payload, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid id" });
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const stats = async (req, res) => {
  try {
    const total = await Todo.countDocuments();
    const completed = await Todo.countDocuments({ status: true });
    const pending = total - completed;
    res.json({ total, completed, pending });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
