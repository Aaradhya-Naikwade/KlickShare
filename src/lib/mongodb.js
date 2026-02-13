// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

// let isConnected = false;

// export default async function connectMongo() {
//   if (isConnected) return;

//   try {
//     const db = await mongoose.connect(MONGODB_URI, {
//       dbName: "klickshare-demo",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     isConnected = db.connections[0].readyState === 1;
//     console.log("MongoDB connected successfully");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     throw err;
//   }
// }








import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectMongo() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "klickshare-demo",
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
