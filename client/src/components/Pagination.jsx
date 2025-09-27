export default function Pagination({ page, pages, onChange }) {
  return (
    <div className="flex items-center gap-2 mt-4 text-gray-900 dark:text-gray-100">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 disabled:opacity-50 transition-colors"
      >
        Prev
      </button>
      <span>
        Page {page} / {pages}
      </span>
      <button
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 disabled:opacity-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
}
