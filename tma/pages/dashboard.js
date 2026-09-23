import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import StatCard from "@/components/StatCard";
import TaskColumn from "@/components/TaskColumn";

// A task moves through these statuses in this order
const statusOrder = ["pending", "progress", "completed"];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  // localStorage only exists in the browser, so it is read inside useEffect
  useEffect(function () {
    const savedUser = localStorage.getItem("currentUser");

    if (!savedUser) {
      router.replace("/login");
      return;
    }

    const loggedInUser = JSON.parse(savedUser);

    // Users saved by the old localStorage version have no id, so log them out
    if (!loggedInUser.id) {
      localStorage.removeItem("currentUser");
      router.replace("/login");
      return;
    }

    setUser(loggedInUser);
    loadTasks(loggedInUser.id);
  }, []);

  async function loadTasks(userId) {
    try {
      const response = await fetch("/api/tasks?userId=" + userId);
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
      } else {
        setTasks(data.tasks);
      }
    } catch (err) {
      setError("Could not load tasks");
    }

    setLoadingTasks(false);
  }

  async function handleAddTask(event) {
    event.preventDefault();
    setError("");

    if (newTask.trim() === "") {
      return;
    }

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, title: newTask }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      setTasks([...tasks, data.task]);
      setNewTask("");
    } catch (err) {
      setError("Could not add the task");
    }
  }

  // Shared by edit and move: sends the changes to the API,
  // then replaces the old task with the updated one from the server
  async function updateTask(id, changes) {
    setError("");

    try {
      const response = await fetch("/api/tasks/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...changes, userId: user.id }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      const updatedTasks = tasks.map(function (task) {
        if (task.id === id) {
          return data.task;
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (err) {
      setError("Could not update the task");
    }
  }

  function editTask(id, newTitle) {
    updateTask(id, { title: newTitle });
  }

  // direction is "left" (previous status) or "right" (next status)
  function moveTask(id, direction) {
    const task = tasks.find((t) => t.id === id);
    const currentIndex = statusOrder.indexOf(task.status);

    let newIndex = currentIndex;
    if (direction === "right") {
      newIndex = currentIndex + 1;
    }
    if (direction === "left") {
      newIndex = currentIndex - 1;
    }

    // Already at the first or last status
    if (newIndex < 0 || newIndex >= statusOrder.length) {
      return;
    }

    updateTask(id, { status: statusOrder[newIndex] });
  }

  async function deleteTask(id) {
    setError("");

    try {
      const response = await fetch("/api/tasks/" + id + "?userId=" + user.id, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const updatedTasks = tasks.filter(function (task) {
        return task.id !== id;
      });
      setTasks(updatedTasks);
    } catch (err) {
      setError("Could not delete the task");
    }
  }

  function handleLogout() {
    localStorage.removeItem("currentUser");
    router.push("/login");
  }

  // Render nothing until we know the user is logged in
  if (!user) {
    return null;
  }

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const progressTasks = tasks.filter((task) => task.status === "progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | TaskFlow</title>
      </Head>

      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              ✓
            </div>
            <span className="text-lg font-bold text-gray-800">TaskFlow</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-gray-600">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks" count={tasks.length} color="text-indigo-600" />
          <StatCard label="Pending" count={pendingTasks.length} color="text-amber-500" />
          <StatCard label="In Progress" count={progressTasks.length} color="text-blue-500" />
          <StatCard label="Completed" count={completedTasks.length} color="text-green-500" />
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 text-red-600 text-sm px-4 py-3">
            {error}
          </p>
        )}

        <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="What do you need to do?"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 transition"
          >
            + Add
          </button>
        </form>

        {loadingTasks ? (
          <p className="text-center text-gray-500 py-16">Loading tasks...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TaskColumn
              title="Pending"
              dotColor="bg-amber-500"
              tasks={pendingTasks}
              onEdit={editTask}
              onMove={moveTask}
              onDelete={deleteTask}
            />
            <TaskColumn
              title="In Progress"
              dotColor="bg-blue-500"
              tasks={progressTasks}
              onEdit={editTask}
              onMove={moveTask}
              onDelete={deleteTask}
            />
            <TaskColumn
              title="Completed"
              dotColor="bg-green-500"
              tasks={completedTasks}
              onEdit={editTask}
              onMove={moveTask}
              onDelete={deleteTask}
            />
          </div>
        )}
      </main>
    </div>
  );
}
