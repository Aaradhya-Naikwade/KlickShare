import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json({ message: "groupId required" }, { status: 400 });
    }

    // populate nested members.user
    const group = await Group.findById(groupId).populate("members.user", "name phone email");
    if (!group) {
      return NextResponse.json({ message: "Group not found" }, { status: 404 });
    }

    // return members array (objects: { user: {..}, joinedAt })
    return NextResponse.json({ members: group.members || [] }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/groups/members error:", err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const groupId = url.searchParams.get("groupId");
    const userId = url.searchParams.get("userId");

    if (!groupId || !userId) {
      return NextResponse.json({ message: "Missing groupId/userId" }, { status: 400 });
    }

    const group = await Group.findById(groupId);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    // Prevent removing group owner (safety)
    if (String(group.createdBy) === String(userId)) {
      return NextResponse.json({ message: "Cannot remove group creator", status: 403 }, { status: 403 });
    }

    // members is array of objects { user, joinedAt }
    group.members = (group.members || []).filter((m: any) => String(m.user || m) !== String(userId));
    await group.save();

    return NextResponse.json({ message: "Member removed" }, { status: 200 });
  } catch (err: any) {
    console.error("DELETE /api/groups/members error:", err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
