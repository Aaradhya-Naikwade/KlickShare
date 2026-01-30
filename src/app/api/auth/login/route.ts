import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number is required." },
        { status: 400 }
      );
    }

    await connectMongo();

    const existingUser = await User.findOne({ phone }).lean();
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found. Please sign up." },
        { status: 404 }
      );
    }

    // 🔥 ALWAYS return fresh data (no cache)
    return NextResponse.json(
      {
        message: "Login successful",
        role: existingUser.role,
        name: existingUser.name,
        userId: existingUser._id.toString(),  // 🔥 VERY IMPORTANT
        phone: existingUser.phone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
