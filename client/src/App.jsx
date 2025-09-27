import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Khi load app, lấy trạng thái dark mode từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem("darkMode") === "true";
    setDarkMode(saved);
  }, []);

  // Thêm/xoá class 'dark' vào html và lưu vào localStorage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📝 Todo App</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 transition-colors"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main>
        <TodoList />
      </main>
    </div>
  );
}
