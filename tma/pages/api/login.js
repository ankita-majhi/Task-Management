import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";

// POST /api/login  -> check email and password, return the user
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (email === "" || password === "") {
    return res.status(400).json({ message: "Please enter email and password" });
  }

  try {
    const db = await getDb();
    const user = await db.collection("users").findOne({ email: email });

    // Compare the typed password with the hash saved in the database
    let passwordMatches = false;
    if (user) {
      passwordMatches = await bcrypt.compare(password, user.password);
    }

    // Use one generic message so we don't reveal which emails are registered
    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Send back only safe fields, never the password
    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
