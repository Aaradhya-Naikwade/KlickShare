import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Otp from "@/models/Otp";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { phone, otp } = (await req.json()) as { phone: string; otp: string };
    if (!phone || !otp) return NextResponse.json({ message: "Phone & OTP required" }, { status: 400 });

    await connectMongo();

    const record = await Otp.findOne({ phone });
    if (!record) return NextResponse.json({ message: "OTP not sent" }, { status: 400 });
    if (record.expiresAt < new Date()) return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();
      return NextResponse.json({ message: "Incorrect OTP" }, { status: 400 });
    }

    await Otp.deleteOne({ phone });

    const user = await User.findOne({ phone });

    const token = signToken({ phone, userId: user?._id.toString(), role: user?.role || "viewer" });

    const response = NextResponse.json({
      message: "OTP verified",
      user: user ? { phone, userId: user._id, role: user.role } : null,
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
