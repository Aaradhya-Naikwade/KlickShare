import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://aaradhyanaikwade2520_db_user:ehxPQkSvn5RlsNEq@cluster0.ewtpwpx.mongodb.net/?appName=Cluster0";

// Prevent multiple connections during development (Next.js hot reload fix)
let isConnected = false;

export default async function connectMongo() {
  if (isConnected) {
    console.log("✅ MongoDB already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "klickshare-demo", // <- your Atlas database name
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = db.connections[0].readyState === 1;

    console.log("🚀 MongoDB Connected Successfully to klickshare-demo");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}
