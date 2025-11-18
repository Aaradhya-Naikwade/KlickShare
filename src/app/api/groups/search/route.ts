import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json({ groups: [] }, { status: 200 });
    }

    // Check if query is valid ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(query);

    // Build dynamic search
    const searchConditions: any = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];

    // If query looks like an ObjectId, push it
    if (isValidObjectId) {
      searchConditions.push({ _id: query });
    }

    const groups = await Group.find({
      isPublic: true,
      $or: searchConditions,
    })
      .populate("createdBy", "name email phone")
      .limit(20)
      .lean();

    return NextResponse.json({ groups }, { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
