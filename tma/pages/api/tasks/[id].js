import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";

const allowedStatuses = ["pending", "progress", "completed"];

// PUT    /api/tasks/:id  -> update a task's title and/or status
// DELETE /api/tasks/:id  -> delete a task
export default async function handler(req, res) {
  const id = req.query.id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid task id" });
  }

  try {
    const db = await getDb();

    if (req.method === "PUT") {
      const userId = req.body.userId;
      const changes = {};

      if (req.body.title !== undefined) {
        const title = req.body.title.trim();
        if (title === "") {
          return res.status(400).json({ message: "Title cannot be empty" });
        }
        changes.title = title;
      }

      if (req.body.status !== undefined) {
        if (!allowedStatuses.includes(req.body.status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
        changes.status = req.body.status;
      }

      // Matching on userId too means a user can only change their own tasks
      const result = await db
        .collection("tasks")
        .findOneAndUpdate(
          { _id: new ObjectId(id), userId: userId },
          { $set: changes },
          { returnDocument: "after" }
        );

      if (!result) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.status(200).json({
        task: {
          id: result._id.toString(),
          title: result.title,
          status: result.status,
          createdAt: result.createdAt,
        },
      });
    }

    if (req.method === "DELETE") {
      const userId = req.query.userId;

      const result = await db
        .collection("tasks")
        .deleteOne({ _id: new ObjectId(id), userId: userId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Task not found" });
      }

      return res.status(200).json({ message: "Task deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
