import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import JoinRequest from "@/models/JoinRequest";
import Group from "@/models/Group";

export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const groupId = searchParams.get("groupId");

    if (!userId || !groupId) {
      return NextResponse.json(
        { message: "userId and groupId are required" },
        { status: 400 }
      );
    }

    // ---------------------------------------------
    // 1️⃣ CHECK GROUP + IF USER IS MEMBER
    // ---------------------------------------------
    const group = await Group.findById(groupId)
      .select("members")
      .lean();

    if (!group) {
      return NextResponse.json(
        { message: "Group not found", status: "none" },
        { status: 404 }
      );
    }

    const isMember = group.members?.some(
      (m: any) => String(m.user) === String(userId)
    );

    // ---------------------------------------------
    // 2️⃣ FETCH LATEST JOIN REQUEST
    // ---------------------------------------------
    const jr = await JoinRequest.findOne({
      user: userId,
      group: groupId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // ---------------------------------------------
    // CASE A — ALREADY JOINED
    // ---------------------------------------------
    if (isMember) {
      return NextResponse.json({ status: "joined" });
    }

    // ---------------------------------------------
    // CASE B — NEVER REQUESTED
    // ---------------------------------------------
    if (!jr) {
      return NextResponse.json({ status: "none" });
    }

    // ---------------------------------------------
    // CASE C — OLD APPROVED BUT USER LEFT LATER
    // ---------------------------------------------
    if (jr.status === "approved" && !isMember) {
      return NextResponse.json({ status: "none" });
    }

    // ---------------------------------------------
    // CASE D — PENDING REQUEST
    // ---------------------------------------------
    if (jr.status === "pending") {
      return NextResponse.json({ status: "pending" });
    }

    // ---------------------------------------------
    // CASE E — REJECTED REQUEST
    // ---------------------------------------------
    if (jr.status === "rejected") {
      return NextResponse.json({ status: "rejected" });
    }

    // Default fallback
    return NextResponse.json({ status: "none" });

  } catch (err: any) {
    console.error("STATUS API ERROR:", err);
    return NextResponse.json(
      { message: "Internal error", error: err.message },
      { status: 500 }
    );
  }
}
