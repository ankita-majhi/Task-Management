import { getDb } from "@/lib/mongodb";

// MongoDB uses "_id", but the frontend works with a plain "id" string
function formatTask(task) {
  return {
    id: task._id.toString(),
    title: task.title,
    status: task.status,
    createdAt: task.createdAt,
  };
}

// GET  /api/tasks?userId=...  -> get all tasks of a user
// POST /api/tasks             -> create a new task
export default async function handler(req, res) {
  try {
    const db = await getDb();

    if (req.method === "GET") {
      const userId = req.query.userId;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const tasks = await db
        .collection("tasks")
        .find({ userId: userId })
        .sort({ createdAt: 1 })
        .toArray();

      return res.status(200).json({ tasks: tasks.map(formatTask) });
    }

    if (req.method === "POST") {
      const userId = req.body.userId;
      const title = (req.body.title || "").trim();

      if (!userId || title === "") {
        return res.status(400).json({ message: "userId and title are required" });
      }

      const newTask = {
        userId: userId,
        title: title,
        status: "pending",
        createdAt: new Date(),
      };

      const result = await db.collection("tasks").insertOne(newTask);
      newTask._id = result.insertedId;

      return res.status(201).json({ task: formatTask(newTask) });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
