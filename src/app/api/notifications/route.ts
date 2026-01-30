import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Notification from "@/models/Notification";

/**
 * ===========================
 * GET NOTIFICATIONS
 * ===========================
 * Query:  ?userId=<id>
 * Returns:
 *  - all notifications sorted by newest
 *  - unreadCount
 */
export async function GET(req: Request) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "userId required" },
        { status: 400 }
      );
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return NextResponse.json(
      { notifications, unreadCount },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

/**
 * ===========================
 * MARK AS READ
 * ===========================
 * Body:
 *  { notificationId: string }
 */
export async function PUT(req: Request) {
  try {
    await connectMongo();

    const { notificationId } = await req.json();

    if (!notificationId) {
      return NextResponse.json(
        { message: "notificationId required" },
        { status: 400 }
      );
    }

    await Notification.findByIdAndUpdate(notificationId, { read: true });

    return NextResponse.json(
      { message: "Marked as read" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("PUT /api/notifications error:", err);
    return NextResponse.json(
      { message: "Error marking read", error: err.message },
      { status: 500 }
    );
  }
}

/**
 * ===========================
 * DELETE NOTIFICATION
 * ===========================
 * Query:  ?id=<notificationId>
 */
export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "id required" },
        { status: 400 }
      );
    }

    await Notification.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Deleted" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("DELETE /api/notifications error:", err);
    return NextResponse.json(
      { message: "Error deleting", error: err.message },
      { status: 500 }
    );
  }
}
