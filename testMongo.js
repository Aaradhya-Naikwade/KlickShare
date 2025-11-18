import mongoose from "mongoose";

const uri = "mongodb+srv://aaradhyanaikwade08_db_user:KlickShareDB2025secure@cluster0.wnpdfti.mongodb.net/klickshare?retryWrites=true&w=majority&appName=Cluster0";

async function testConnection() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("✅ Connected to MongoDB Atlas!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }
}

testConnection();
