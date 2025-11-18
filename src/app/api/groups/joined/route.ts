import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";

export async function GET(req: Request) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "userId required" }, { status: 400 });
    }

    // Find groups where members.user matches userId
    const groups = await Group.find({ "members.user": userId })
      .populate("createdBy", "name phone")
      .lean();

    return NextResponse.json({ groups }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/groups/joined error:", err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
