

// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import User from "@/models/User";

// export async function GET(req: Request) {
//   try {
//     await connectMongo();

//     const { searchParams } = new URL(req.url);
//     const phone = searchParams.get("phone");

//     if (!phone) {
//       return NextResponse.json({ message: "Phone number required" }, { status: 400 });
//     }

//     const user = await User.findOne({ phone }).lean();
        
//     if (!user) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json({ user }, { status: 200 });
//   } catch (err: any) {
//     console.error("Profile API error:", err);
//     return NextResponse.json(
//       { message: "Internal server error", error: err.message },
//       { status: 500 }
//     );
//   }
// }







import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(request: Request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone required",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        companyName: user.companyName,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
