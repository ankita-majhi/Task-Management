import { useState } from "react";

// A single task card with edit, move and delete actions
export default function TaskCard({ task, onEdit, onMove, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.title);

  function handleSave(event) {
    event.preventDefault();

    if (editText.trim() === "") {
      return;
    }

    onEdit(task.id, editText);
    setIsEditing(false);
  }

  function handleCancel() {
    // Throw away unsaved changes
    setEditText(task.title);
    setIsEditing(false);
  }

  function handleDelete() {
    const sure = window.confirm("Delete this task?");
    if (sure) {
      onDelete(task.id);
    }
  }

  if (isEditing) {
    return (
      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg p-4 shadow-sm border-2 border-indigo-400"
      >
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          autoFocus
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        />
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition">
      <p
        className={
          task.status === "completed"
            ? "text-gray-400 line-through"
            : "text-gray-800 font-medium"
        }
      >
        {task.title}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Added on {new Date(task.createdAt).toLocaleDateString()}
      </p>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          {/* A pending task can't move back, and a completed task can't move forward */}
          {task.status !== "pending" && (
            <button
              onClick={() => onMove(task.id, "left")}
              className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
            >
              ← Back
            </button>
          )}

          {task.status !== "completed" && (
            <button
              onClick={() => onMove(task.id, "right")}
              className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-100"
            >
              Next →
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-gray-500 hover:text-indigo-600"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-xs font-medium text-gray-500 hover:text-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
