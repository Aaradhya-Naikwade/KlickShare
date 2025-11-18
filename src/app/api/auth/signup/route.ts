import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, role, companyName } = body;

    if (!name || !email || !phone || !role) {
      return NextResponse.json(
        { message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    await connectMongo();

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already registered with this phone number." },
        { status: 400 }
      );
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      phone,
      companyName,
      role,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "Signup successful!", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup API Error:", error);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
