import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri || !dbName) {
  throw new Error("Please add MONGODB_URI and MONGODB_DB to .env.local");
}

// Open the connection only once and reuse it for every request.
// It is stored on "global" so that hot reloading in development
// does not keep opening new connections.
export async function getDb() {
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }

  try {
    const client = await global._mongoClientPromise;
    return client.db(dbName);
  } catch (error) {
    // Forget the failed attempt so the next request tries again
    global._mongoClientPromise = null;
    throw error;
  }
}
