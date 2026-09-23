import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

// POST /api/signup  -> create a new user
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (name === "" || email === "" || password === "") {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const db = await getDb();

    const userExists = await db.collection("users").findOne({ email: email });
    if (userExists) {
      return res.status(409).json({ message: "This email is already registered" });
    }

    // Never store the real password, only its hash
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name: name,
      email: email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Account created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
