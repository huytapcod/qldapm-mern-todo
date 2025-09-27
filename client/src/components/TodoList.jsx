import { useEffect, useState } from "react";
import api from "../api/api";
import TodoForm from "./TodoForm";
import Pagination from "./Pagination";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState(""); // "", "true", "false"
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [editTodo, setEditTodo] = useState(null);

  const fetchTodos = async (p = page) => {
    try {
      setLoading(true);
      const res = await api.get("/todos", {
        params: {
          page: p,
          limit: 5,
          status: statusFilter || undefined,
          q: q || undefined,
        },
      });
      setTodos(res.data.data);
      setPages(res.data.pages || 1);
      setPage(res.data.page || 1);
    } catch (err) {
      console.error(err);
      alert("Error fetching todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos(1);
  }, [statusFilter, q]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      await api.delete(`/todos/${id}`);
      fetchTodos(page);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const toggleStatus = async (todo) => {
    try {
      await api.put(`/todos/${todo._id}`, { status: !todo.status });
      fetchTodos(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Todo App
      </h1>

      <div className="mb-4">
        <TodoForm
          onSaved={() => fetchTodos(1)}
          editTodo={editTodo}
          onCancel={() => setEditTodo(null)}
        />
      </div>

      <div className="flex gap-2 items-center mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
        >
          <option value="">All</option>
          <option value="true">Done</option>
          <option value="false">Pending</option>
        </select>
        <input
          className="border px-2 py-1 rounded flex-1 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          placeholder="Search title"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={() => fetchTodos(1)}
          className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-600 dark:text-gray-100 dark:border-gray-600"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-gray-900 dark:text-gray-100">Loading...</div>
      ) : (
        <ul className="bg-white dark:bg-gray-800 rounded shadow divide-y divide-gray-200 dark:divide-gray-700">
          {todos.map((t) => (
            <li
              key={t._id}
              className="p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div>
                <div className="font-medium">{t.title}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t.dueAt
                    ? `Due: ${new Date(t.dueAt).toLocaleDateString()}`
                    : ""}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => toggleStatus(t)}
                  className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  {t.status ? "Mark Pending" : "Mark Done"}
                </button>
                <button
                  onClick={() => setEditTodo(t)}
                  className="px-2 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        pages={pages}
        onChange={(p) => {
          setPage(p);
          fetchTodos(p);
        }}
      />
    </div>
  );
}
