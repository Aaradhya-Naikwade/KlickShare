import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const userId = searchParams.get("userId");  // 🔥 priority
    const phone = searchParams.get("phone");    // fallback

    await connectMongo();

    let user = null;

    // 1️⃣ FIRST: Find by userId (most accurate)
    if (userId) {
      user = await User.findById(userId).lean();
    }

    // 2️⃣ SECOND: Find by phone (fallback)
    if (!user && phone) {
      user = await User.findOne({ phone }).lean();
    }

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
