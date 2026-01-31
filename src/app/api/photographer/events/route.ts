import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Event from "@/models/Event";
import User from "@/models/User";
import Group from "@/models/Group";


// ----------------------------------------------------
// POST → Create Event
// ----------------------------------------------------
export async function POST(req: Request) {
  try {
    await connectMongo();

    const body = await req.json();
    const { name, description, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { message: "Event name and phone are required" },
        { status: 400 }
      );
    }

    // Find photographer
    const photographer = await User.findOne({ phone });
    if (!photographer) {
      return NextResponse.json(
        { message: "Photographer not found" },
        { status: 404 }
      );
    }

    if (photographer.role !== "photographer") {
      return NextResponse.json(
        { message: "Only photographers can create events" },
        { status: 403 }
      );
    }

    const event = await Event.create({
      name,
      description,
      createdBy: photographer._id,
    });

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Create Event Error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// GET → Fetch Photographer Events
// ----------------------------------------------------
export async function GET(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { message: "Phone is required" },
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

    const events = await Event.find({ createdBy: photographer._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ events }, { status: 200 });
  } catch (err: any) {
    console.error("Fetch Events Error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}


// ----------------------------------------------------
// DELETE → Delete Event + ALL Groups inside it
// ----------------------------------------------------
export async function DELETE(req: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("id");

    if (!eventId) {
      return NextResponse.json(
        { message: "Event id is required" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    // 🔥 DELETE ALL GROUPS UNDER THIS EVENT
    await Group.deleteMany({ event: eventId });

    // 🔥 DELETE EVENT
    await Event.findByIdAndDelete(eventId);

    return NextResponse.json(
      { message: "Event and all its groups deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Delete Event Error:", err);
    return NextResponse.json(
      { message: "Internal server error", error: err.message },
      { status: 500 }
    );
  }
}

