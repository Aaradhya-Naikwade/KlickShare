import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Downloaded from "@/models/Downloaded";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const { userId, photo, groupId } = await req.json();

    if (!userId || !photo || !groupId) {
      return NextResponse.json(
        { message: "userId, photo, groupId required" },
        { status: 400 }
      );
    }

    await Downloaded.create({ user: userId, photo, group: groupId });

    return NextResponse.json({ message: "Saved" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Internal error", error: e.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await connectMongo();
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ message: "userId required" }, { status: 400 });

    const downloads = await Downloaded.find({ user: userId })
      .populate("group", "name coverPhoto")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ downloads });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Internal error", error: e.message },
      { status: 500 }
    );
  }
}
