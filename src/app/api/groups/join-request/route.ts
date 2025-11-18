import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import Group from "@/models/Group";
import JoinRequest from "@/models/JoinRequest";
import Notification from "@/models/Notification";

// ----------------------------------------------------
// POST → SEND JOIN REQUEST
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    await connectMongo();

    const { groupId, phone, message } = await req.json();

    if (!groupId || !phone) {
      return NextResponse.json(
        { message: "groupId and phone are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ phone }).lean();
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const group = await Group.findById(groupId).lean();
    if (!group)
      return NextResponse.json({ message: "Group not found" }, { status: 404 });

    // 1️⃣ Already a member?
    const isMember = group.members?.some(
      (m: any) => String(m.user) === String(user._id)
    );

    if (isMember) {
      return NextResponse.json({
        status: "joined",
        message: "You are already a member",
      });
    }

    // 2️⃣ Find latest join request by this user
    const existing = await JoinRequest.findOne({
      user: user._id,
      group: groupId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // ------------------------------------------
    // CORRECT FIX — return correct status
    // ------------------------------------------
    if (existing) {
      if (existing.status === "pending") {
        return NextResponse.json({
          status: "pending",
          message: "Your request is still pending",
        });
      }

      if (existing.status === "approved") {
        return NextResponse.json({
          status: "joined",
          message: "You are already a member",
        });
      }

      if (existing.status === "rejected") {
        // allow fresh request
      }
    }

    // 3️⃣ Create new join request
    const newReq = await JoinRequest.create({
      user: user._id,
      group: groupId,
      status: "pending",
      message: message || "",
    });

    // 4️⃣ Notify Photographer
    await Notification.create({
      user: group.createdBy,
      title: "New Join Request",
      body: `${user.name || user.phone} requested to join your group "${group.name}".`,
      link: `/dashboard/photographer/groups/${groupId}`,
      data: { groupId, requestId: newReq._id },
    });

    return NextResponse.json({
      status: "pending",
      message: "Join request sent successfully!",
    });
  } catch (err: any) {
    console.error("POST join request error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// GET → FETCH JOIN REQUESTS
// ----------------------------------------------------
export async function GET(req: Request) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const photographerId = url.searchParams.get("photographerId");
    const groupId = url.searchParams.get("groupId");
    const status = url.searchParams.get("status");

    if (photographerId) {
      const groups = await Group.find({ createdBy: photographerId })
        .select("_id")
        .lean();

      const groupIds = groups.map((g) => g._id);

      const filter: any = { group: { $in: groupIds } };
      if (groupId) filter.group = groupId;
      if (status) filter.status = status;

      const requests = await JoinRequest.find(filter)
        .populate("user", "name phone email")
        .populate("group", "name coverPhoto")
        .sort({ createdAt: -1 })
        .lean();

      return NextResponse.json({ requests });
    }

    if (groupId) {
      const filter: any = { group: groupId };
      if (status) filter.status = status;

      const requests = await JoinRequest.find(filter)
        .populate("user", "name phone email")
        .populate("group", "name coverPhoto")
        .lean();

      return NextResponse.json({ requests });
    }

    return NextResponse.json(
      { message: "photographerId or groupId required" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("GET join-request error:", err);
    return NextResponse.json(
      { message: "Internal error", error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// PUT → APPROVE / REJECT
// ----------------------------------------------------
export async function PUT(req: Request) {
  try {
    await connectMongo();

    const { requestId, action, photographerId } = await req.json();

    if (!requestId || !action) {
      return NextResponse.json(
        { message: "requestId and action are required" },
        { status: 400 }
      );
    }

    const jr = await JoinRequest.findById(requestId)
      .populate("user")
      .populate("group");

    if (!jr)
      return NextResponse.json({ message: "Join request not found" });

    const group = await Group.findById(jr.group._id);
    if (!group)
      return NextResponse.json({ message: "Group not found" });

    if (photographerId && String(group.createdBy) !== String(photographerId)) {
      return NextResponse.json({ message: "Not authorized" }, { status: 403 });
    }

    if (action === "approve") {
      const uid = jr.user._id;

      const exists = group.members.some(
        (m: any) => String(m.user) === String(uid)
      );

      if (!exists) {
        group.members.push({ user: uid, joinedAt: new Date() });
        await group.save();
      }

      jr.status = "approved";
      await jr.save();

      await Notification.create({
        user: uid,
        title: "Join Request Approved",
        body: `Your request to join "${group.name}" has been approved.`,
        link: `/dashboard/user/group/${group._id}`,
      });

      return NextResponse.json({ message: "Request approved" });
    }

    if (action === "reject") {
      jr.status = "rejected";
      await jr.save();

      await Notification.create({
        user: jr.user._id,
        title: "Join Request Rejected",
        body: `Your request to join "${group.name}" was rejected.`,
      });

      return NextResponse.json({ message: "Request rejected" });
    }

    return NextResponse.json({ message: "Invalid action" });
  } catch (err: any) {
    console.error("PUT join-request error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
