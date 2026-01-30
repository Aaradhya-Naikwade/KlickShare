import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Otp from "@/models/Otp";
import { sendOtpSMS } from "@/lib/sendOtp";

export async function POST(req: Request) {
  try {
    const { phone } = (await req.json()) as { phone: string };
    if (!phone || phone.length !== 10) return NextResponse.json({ message: "Invalid phone" }, { status: 400 });

    await connectMongo();

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    await Otp.findOneAndUpdate(
      { phone },
      { otp, expiresAt, attempts: 0 },
      { upsert: true, new: true }
    );

    await sendOtpSMS(phone, otp);

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
