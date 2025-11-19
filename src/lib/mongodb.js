import mongoose from "mongoose";

// const MONGODB_URI = "mongodb+srv://aaradhyanaikwade2520_db_user:ehxPQkSvn5RlsNEq@cluster0.ewtpwpx.mongodb.net/?appName=Cluster0";

// Ab yeh value .env.local (local) ya Vercel settings (live) se uthayega
const MONGODB_URI = process.env.MONGODB_URI; 

// Optional: Agar MONGODB_URI set nahi hai toh error throw karein
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is not set.");
}

// Prevent multiple connections during development (Next.js hot reload fix)
let isConnected = false;

export default async function connectMongo() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "klickshare-demo", // <- your Atlas database name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("MongoDB Connected Successfully to klickshare");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
}