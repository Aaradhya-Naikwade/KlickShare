import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import path from "path";
import fs from "fs";

// ----------------------------------------------------
// GET → Fetch Single Group
// ----------------------------------------------------
export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Group id required" },
        { status: 400 }
      );
    }

    const group = await Group.findById(id)
      .populate("createdBy", "name phone email avatar")
      .lean();

    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ group }, { status: 200 });
  } catch (err: any) {
    console.error("GET /api/groups error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// PUT → Update Group + Optional Cover Upload
// ----------------------------------------------------
export async function PUT(req: Request) {
  try {
    await connectMongo();

    const form = await req.formData();

    const id = form.get("id") as string;
    const name = form.get("name") as string | null;
    const description = form.get("description") as string | null;

    // isPublic will be "true" | "false" | null
    const isPublicRaw = form.get("isPublic");
    const isPublic =
      isPublicRaw !== null ? String(isPublicRaw) === "true" : undefined;

    if (!id) {
      return NextResponse.json(
        { message: "Group id required" },
        { status: 400 }
      );
    }

    const group = await Group.findById(id);
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    // Update only provided fields
    if (name !== null) group.name = name;
    if (description !== null) group.description = description;
    if (isPublic !== undefined) group.isPublic = isPublic;

    // --------------------------------------------
    // COVER PHOTO UPLOAD
    // --------------------------------------------
    const file = form.get("coverPhoto") as unknown as File | null;

    if (file && file.size > 0) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: "Only PNG/JPG images allowed" },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name) || ".jpg";

      const uniqueName =
        Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "groups"
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, uniqueName);
      fs.writeFileSync(filePath, buffer);

      group.coverPhoto = `/uploads/groups/${uniqueName}`;
    }

    await group.save();

    const updated = await Group.findById(id)
      .populate("createdBy", "name phone email avatar")
      .lean();

    return NextResponse.json(
      { message: "Group updated", group: updated },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PUT /api/groups error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}
