import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    await connectMongo();

    const body = await request.json();
    const { phone, name, email, role, companyName } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone is required" },
        { status: 400 }
      );
    }

    // check existing user
    let user = await User.findOne({ phone });

    // EXISTING USER → LOGIN
    if (user) {
      return NextResponse.json({
        success: true,
        isNewUser: false,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          name: user.name,
          phone: user.phone,
          email: user.email,
          role: user.role,
          companyName: user.companyName,
        },
      });
    }

    // NEW USER BUT NO NAME/ROLE → DO NOT CREATE YET
    if (!name || !role) {
      return NextResponse.json({
        success: true,
        isNewUser: true,
        message: "New user detected",
      });
    }

    // CREATE USER
    user = await User.create({
      phone,
      name,
      email,
      role,
      companyName,
    });

    return NextResponse.json({
      success: true,
      isNewUser: true,
      message: "Signup successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
    });

  } catch (error) {
    console.error("AUTH ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
