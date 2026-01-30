import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";
import Group from "@/models/Group";

import multer from "multer";
import path from "path";
import { promisify } from "util";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/groups");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

const runMiddleware = promisify(upload.single("coverPhoto"));

// ------- POST - CREATE GROUP -------
export async function POST(req: Request) {
  try {
    await connectMongo();

    // FormData read
    const form = await req.formData();

    const name = form.get("name") as string;
    const description = form.get("description") as string;
    const isPublic = form.get("isPublic") === "true";
    const phone = form.get("phone") as string;

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Group name & phone are required." },
        { status: 400 }
      );
    }

    // find photographer
    const photographer = await User.findOne({ phone });
    if (!photographer) {
      return NextResponse.json(
        { message: "Photographer not found." },
        { status: 404 }
      );
    }

    // Handle cover photo (optional)
    let coverPhotoPath = "/default-cover.png";

    const file = form.get("coverPhoto") as unknown as File;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = path.extname(file.name);
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = unique + ext;
      const uploadPath = `public/uploads/groups/${fileName}`;

      // Save file manually
      const fs = require("fs");
      fs.writeFileSync(uploadPath, buffer);

      coverPhotoPath = `/uploads/groups/${fileName}`;
    }

    // create group
    const newGroup = await Group.create({
      name,
      description,
      isPublic,
      createdBy: photographer._id,
      coverPhoto: coverPhotoPath,
    });

    return NextResponse.json(
      {
        message: "Group created successfully",
        group: newGroup,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Group Create Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// ------- GET - FETCH ALL GROUPS -------
export async function GET(req: Request) {
  try {
    await connectMongo();
   
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { message: "Phone number required" },
        { status: 400 }
      );
    }

    const photographer = await User.findOne({ phone });

    if (!photographer) {
      return NextResponse.json(
        { message: "Photographer not found" },
        { status: 404 }
      );
    }

    const groups = await Group.find({ createdBy: photographer._id })
      .populate("members", "_id name")
      .lean();

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Groups Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
    
// ------- DELETE GROUP -------
export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Group ID is required" },
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

    await Group.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Group Deleted Successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Delete Group Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }  
}