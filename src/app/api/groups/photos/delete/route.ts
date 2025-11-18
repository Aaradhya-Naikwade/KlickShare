import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import path from "path";
import fs from "fs";

export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const url = searchParams.get("url");

    if (!groupId || !url) {
      return NextResponse.json({ message: "Missing groupId/url" }, { status: 400 });
    }

    const group = await Group.findById(groupId);
    if (!group)
      return NextResponse.json({ message: "Group not found" }, { status: 404 });

    // file path inside public folder
    const filePath = path.join(process.cwd(), "public", url);

    // delete file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // remove from DB
    await Group.findByIdAndUpdate(groupId, {
      $pull: { photos: url },
    });

    return NextResponse.json({ message: "Photo deleted" }, { status: 200 });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { message: "Internal error", error: err },
      { status: 500 }
    );
  }
}
