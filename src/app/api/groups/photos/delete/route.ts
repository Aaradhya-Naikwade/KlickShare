// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import Group from "@/models/Group";
// import path from "path";
// import fs from "fs";

// export async function DELETE(req: Request) {
//   try {
//     await connectMongo();

//     const { searchParams } = new URL(req.url);
//     const groupId = searchParams.get("groupId");
//     const url = searchParams.get("url");

//     if (!groupId || !url) {
//       return NextResponse.json({ message: "Missing groupId/url" }, { status: 400 });
//     }

//     const group = await Group.findById(groupId);
//     if (!group)
//       return NextResponse.json({ message: "Group not found" }, { status: 404 });

//     // file path inside public folder
//     const filePath = path.join(process.cwd(), "public", url);

//     // delete file
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//     }

//     // remove from DB
//     await Group.findByIdAndUpdate(groupId, {
//       $pull: { photos: url },
//     });

//     return NextResponse.json({ message: "Photo deleted" }, { status: 200 });
//   } catch (err) {
//     console.error("Delete error:", err);
//     return NextResponse.json(
//       { message: "Internal error", error: err },
//       { status: 500 }
//     );
//   }
// }







import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";

const PYTHON_FACE_API =
  process.env.PYTHON_FACE_API || "http://127.0.0.1:8000";

export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const groupId = searchParams.get("groupId");
    const imageUrl = searchParams.get("url");

    if (!groupId || !imageUrl) {
      return NextResponse.json(
        { message: "Missing groupId or url" },
        { status: 400 }
      );
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    // -----------------------------------------
    // 1️⃣ DELETE IMAGE FROM PYTHON (S3 + FAISS)
    // -----------------------------------------
    const pyRes = await fetch(`${PYTHON_FACE_API}/delete-image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image_url: imageUrl }),
    });

    if (!pyRes.ok) {
      const err = await pyRes.text();
      console.error("Python delete failed:", err);
      return NextResponse.json(
        { message: "Failed to delete image from storage" },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 2️⃣ REMOVE IMAGE URL FROM MONGODB
    // -----------------------------------------
    await Group.findByIdAndUpdate(groupId, {
      $pull: { photos: imageUrl },
    });

    return NextResponse.json(
      { message: "Photo deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE PHOTO ERROR:", err);
    return NextResponse.json(
      { message: "Internal error", error: err.message },
      { status: 500 }
    );
  }
}
