import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import Notification from "@/models/Notification";

export async function POST(req: Request) {
  try {
    await connectMongo();
    const body = await req.json();
    const { groupId, userId } = body;

    if (!groupId || !userId) {
      return NextResponse.json({ message: "groupId and userId required" }, { status: 400 });
    }

    const group = await Group.findById(groupId);
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    // remove member
    const before = group.members.length;
    group.members = group.members.filter((m: any) => String(m.user) !== String(userId));
    const after = group.members.length;

    if (after === before) {
      return NextResponse.json({ message: "You are not a member" }, { status: 400 });
    }

    await group.save();

    // optional: notify photographer that a user left
    try {
      await Notification.create({
        user: group.createdBy,
        title: "Member left group",
        body: `A member left your group "${group.name}"`,
        link: `/dashboard/photographer/group/${group._id}`
      });
    } catch (nerr) {
      console.warn("Leave: notification error:", nerr);
    }

    return NextResponse.json({ message: "Left group" }, { status: 200 });
  } catch (err: any) {
    console.error("POST /api/groups/leave error:", err);
    return NextResponse.json({ message: "Internal server error", error: err.message }, { status: 500 });
  }
}
