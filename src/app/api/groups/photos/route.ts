import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import User from "@/models/User";
import Notification from "@/models/Notification";

export const runtime = "nodejs"; 

const PYTHON_API = process.env.PYTHON_FACE_API || "http://127.0.0.1:8000";

export async function POST(req: Request) {
  console.log("POST /api/groups/upload called");

  try {
    await connectMongo(); 

    const form = await req.formData();

    const groupId = form.get("groupId") as string | null;
    const photographerId = form.get("photographerId") as string | null;
    const files = form.getAll("photos") as File[];

    if (!groupId) return NextResponse.json({ message: "groupId required" }, { status: 400 });
    if (!photographerId) return NextResponse.json({ message: "photographerId required" }, { status: 400 });
    if (!files || files.length === 0) return NextResponse.json({ message: "No files uploaded" }, { status: 400 });

    const group = await Group.findById(groupId).populate("members.user", "_id");
    if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!file?.name) continue;

      const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowed.includes(file.type)) continue;

      if (file.size > 100 * 1024 * 1024) continue; // 100MB limit

      const fd = new FormData();
      const bytes = await file.arrayBuffer();
      fd.append("file", new Blob([bytes], { type: file.type }), file.name);

      fd.append("event_id", group.event.toString());
      fd.append("group_id", groupId);
      fd.append("photographer_id", photographerId);

      const res = await fetch(`${PYTHON_API}/add-face`, { method: "POST", body: fd });
      const text = await res.text();
      let data: any;

      try {
        data = JSON.parse(text);
        console.log(data);
      } catch {
        throw new Error(`Python API returned non-JSON: ${text}`);
      }
if (data.status === "skipped") {
  switch (data.reason) {
    case "image_too_blurry":
      throw new Error("Image is too blurry");
    case "no_face_detected":
      throw new Error("No face detected in image");
    default:
      throw new Error("Image was skipped");
  }
}
      if (!res.ok) throw new Error(data?.detail || `Python error: ${res.status}`);

      uploadedUrls.push(data.s3_url);
    }

    if (uploadedUrls.length === 0) return NextResponse.json({ message: "No valid files uploaded" }, { status: 400 });

    await Group.findByIdAndUpdate(groupId, { $push: { photos: { $each: uploadedUrls } } });

    // Notify members
    try {
      const memberIds = (group.members || []).map(m => String(m.user?._id || m.user));
      const notifications = memberIds.map(mid => ({
        user: mid,
        title: `New photos in "${group.name}"`,
        body: `${uploadedUrls.length} new photo(s) uploaded.`,
        link: `/dashboard/user/group/${groupId}`,
        data: { groupId, photos: uploadedUrls },
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      if (notifications.length > 0) await Notification.insertMany(notifications);
    } catch (err) {
      console.warn("Notification create error:", err);
    }

    return NextResponse.json({ message: "Files uploaded", files: uploadedUrls }, { status: 200 });
  } catch (err: any) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json({ message: "Internal error", error: err.message }, { status: 500 });
  }
}
