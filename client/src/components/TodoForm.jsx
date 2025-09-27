import { useState, useEffect } from "react";
import api from "../api/api";

export default function TodoForm({ onSaved, editTodo, onCancel }) {
  const [title, setTitle] = useState("");
  const [dueAt, setDueAt] = useState("");

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title || "");
      setDueAt(editTodo.dueAt ? editTodo.dueAt.slice(0, 10) : "");
    } else {
      setTitle("");
      setDueAt("");
    }
  }, [editTodo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    try {
      if (editTodo) {
        await api.put(`/todos/${editTodo._id}`, {
          title,
          dueAt: dueAt || null,
        });
      } else {
        await api.post("/todos", { title, dueAt: dueAt || null });
      }
      setTitle("");
      setDueAt("");
      onSaved();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded shadow transition-colors"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        placeholder="Title"
      />
      <input
        type="date"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
        className="w-full border px-3 py-2 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          {editTodo ? "Update" : "Add"}
        </button>
        {editTodo && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
