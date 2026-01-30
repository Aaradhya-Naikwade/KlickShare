// import { NextResponse } from "next/server";
// import connectMongo from "@/lib/mongodb";
// import Group from "@/models/Group";

// const PYTHON_FACE_API =
//   process.env.PYTHON_FACE_API || "http://127.0.0.1:8000";

// /**
//  * ⚠️ IMPORTANT:
//  * These thresholds are tuned for SMALL / MEDIUM datasets
//  * (few photos per person).
//  */
// const STRONG = 0.65; // was too high before
// const WEAK = 0.52;
// const TOP_K = 15;

// interface FaceMatch {
//   image_url: string;
//   group_id: string;
//   similarity: number;
//   bbox?: number[];
// }

// export async function POST(req: Request) {
//   try {
//     await connectMongo();

//     const form = await req.formData();
//     const file = form.get("file") as File | null;
//     const userId = form.get("userId") as string | null;

//     if (!file || !userId) {
//       return NextResponse.json({ matches: [] });
//     }

//     // ----------------------------
//     // Call Python face service
//     // ----------------------------
//     const fd = new FormData();
//     fd.append("file", file);

//     const pyRes = await fetch(`${PYTHON_FACE_API}/search-face`, {
//       method: "POST",
//       body: fd,
//     });

//     if (!pyRes.ok) {
//       throw new Error("Python face service error");
//     }

//     const pyData = await pyRes.json();
//     const rawMatches: FaceMatch[] = pyData.matches ?? [];

//     if (rawMatches.length === 0) {
//       return NextResponse.json({ matches: [] });
//     }

//     // ----------------------------
//     // Group permission filtering
//     // ----------------------------
//     const groups = await Group.find({
//       $or: [{ createdBy: userId }, { "members.user": userId }],
//     }).select("_id");

//     const allowedGroupIds = new Set(
//       groups.map((g) => String(g._id))
//     );

//     let filtered: FaceMatch[] = rawMatches.filter(
//       (m) =>
//         allowedGroupIds.has(String(m.group_id)) &&
//         typeof m.similarity === "number"
//     );

//     if (filtered.length === 0) {
//       return NextResponse.json({ matches: [] });
//     }

//     // ----------------------------
//     // Sort + limit
//     // ----------------------------
//     filtered.sort((a, b) => b.similarity - a.similarity);
//     filtered = filtered.slice(0, TOP_K);

//     // ----------------------------
//     // Adaptive thresholding
//     // ----------------------------
//     let final: FaceMatch[] = filtered.filter(
//       (m) => m.similarity >= STRONG
//     );

//     if (final.length === 0) {
//       final = filtered.filter(
//         (m) => m.similarity >= WEAK
//       );
//     }

//     /**
//      * 🔥 CRITICAL FALLBACK
//      * If same-person photos exist but similarity is low,
//      * still return top matches (best guesses).
//      */
//     if (final.length === 0 && filtered.length > 0) {
//       final = filtered.slice(0, 3);
//     }

//     // ----------------------------
//     // Return only required fields
//     // ----------------------------
//     return NextResponse.json({
//       matches: final.map((m) => ({
//         image_url: m.image_url,
//         similarity: m.similarity,
//       })),
//     });

//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ matches: [] });
//   }
// }








import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";

const PYTHON_FACE_API =
  process.env.PYTHON_FACE_API || "http://127.0.0.1:8000";

const STRONG = 0.65;
const WEAK = 0.52;
const TOP_K = 50;

interface FaceMatch {
  image_url: string;
  group_id: string;
  similarity: number;
}

export async function POST(req: Request) {
  try {
    await connectMongo();

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const userId = form.get("userId") as string | null;

    if (!file || !userId) {
      return NextResponse.json({ groups: {} });
    }

    // ----------------------------
    // Call Python face service
    // ----------------------------
    const fd = new FormData();
    fd.append("file", file);

    const pyRes = await fetch(`${PYTHON_FACE_API}/search-face`, {
      method: "POST",
      body: fd,
    });

    if (!pyRes.ok) {
      throw new Error("Python face service error");
    }

    const pyData = await pyRes.json();
    const rawMatches: FaceMatch[] = pyData.matches ?? [];

    if (rawMatches.length === 0) {
      return NextResponse.json({ groups: {} });
    }

    // ----------------------------
    // Fetch allowed groups (WITH NAME)
    // ----------------------------
    const userGroups = await Group.find({
      $or: [{ createdBy: userId }, { "members.user": userId }],
    }).select("_id name");

    const groupMap = new Map(
      userGroups.map((g) => [String(g._id), g.name])
    );

    // ----------------------------
    // Permission filtering
    // ----------------------------
    let filtered = rawMatches.filter(
      (m) =>
        groupMap.has(String(m.group_id)) &&
        typeof m.similarity === "number"
    );

    if (filtered.length === 0) {
      return NextResponse.json({ groups: {} });
    }

    // ----------------------------
    // Sort + limit
    // ----------------------------
filtered.sort((a, b) => b.similarity - a.similarity);
    filtered = filtered.slice(0, TOP_K);

    // ----------------------------
    // Threshold logic
    // ----------------------------
let final = filtered.filter(m => m.similarity >= WEAK);
   if (final.length === 0) {
  final = filtered.slice(0, 3);
}
   final = final.map(m => ({
  ...m,
  strength: m.similarity >= STRONG ? "strong" : "weak"
}));

    // ----------------------------
    // Group results WITH NAME
    // ----------------------------
    const grouped: Record<
      string,
      { name: string; matches: { image_url: string; similarity: number }[] }
    > = {};

    for (const m of final) {
      const gid = String(m.group_id);

      if (!grouped[gid]) {
        grouped[gid] = {
          name: groupMap.get(gid) || "Unknown Group",
          matches: [],
        };
      }

      grouped[gid].matches.push({
        image_url: m.image_url,
        similarity: m.similarity,
      });
    }

    return NextResponse.json({ groups: grouped });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ groups: {} });
  }
}
