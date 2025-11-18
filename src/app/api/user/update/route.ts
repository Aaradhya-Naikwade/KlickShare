// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import User from "@/models/User";

// export async function PUT(request: Request) {
//   try {
//     const { phone, name, email } = await request.json();

//     if (!phone) {
//       return NextResponse.json(
//         { message: "Phone number is required" },
//         { status: 400 }
//       );
//     }

//     await connectMongo();

//     const updatedUser = await User.findOneAndUpdate(
//       { phone },
//       { name, email },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return NextResponse.json({ message: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "Profile updated successfully", user: updatedUser },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Update user error:", error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import User from "@/models/User";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email, companyName } = body;

    // Validate
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await connectMongo();

    // Update user by ID
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(companyName && { companyName }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
