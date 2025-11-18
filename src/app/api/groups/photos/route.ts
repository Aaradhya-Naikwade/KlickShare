import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Group from "@/models/Group";
import Notification from "@/models/Notification";
import path from "path";
import fs from "fs";

export async function POST(req: Request) {
    try {
        await connectMongo();

        const form = await req.formData();
        let groupId = (form.get("groupId") as string) || null;
        if (!groupId) {
            const url = new URL(req.url);
            groupId = url.searchParams.get("groupId");
        }
        if (!groupId) return NextResponse.json({ message: "groupId is required" }, { status: 400 });

        const group = await Group.findById(groupId).populate("members.user", "_id");
        if (!group) return NextResponse.json({ message: "Group not found" }, { status: 404 });

        const files = form.getAll("photos") as unknown as File[];
        if (!files || files.length === 0) return NextResponse.json({ message: "No files uploaded" }, { status: 400 });

        const uploadDir = path.join(process.cwd(), "public", "uploads", "photos", groupId);
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const savedFiles: string[] = [];

        for (const file of files) {
            if (!file || !file.name) continue;

            const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            if (!allowed.includes(file.type)) continue;

            const sizeLimit = 20 * 1024 * 1024;
            if (file.size > sizeLimit) continue;

            const buffer = Buffer.from(await file.arrayBuffer());
            const ext = path.extname(file.name) || ".jpg";
            const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const filename = `${unique}${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);

            const publicPath = `/uploads/photos/${groupId}/${filename}`;
            savedFiles.push(publicPath);
        }

        if (savedFiles.length === 0) {
            return NextResponse.json({ message: "No valid files uploaded" }, { status: 400 });
        }

        // push photo URLs into group.photos
        await Group.findByIdAndUpdate(groupId, { $push: { photos: { $each: savedFiles } } });

        // Notify group members (except uploader if needed)
        try {
            // collect member ids
            const memberObjs = group.members || [];
            const memberIds = memberObjs.map((m: any) => m.user ? String(m.user._id || m.user) : String(m));

            // create a notification for each member
            const notifications = memberIds.map((mid: string) => ({
                user: mid,
                title: `New photos in "${group.name}"`,
                body: `${savedFiles.length} new photo(s) were added to the group.`,
                link: `/dashboard/user/group/${groupId}`, // viewer link (adjust as needed)
                data: { groupId, photos: savedFiles },
                read: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (nerr) {
            console.warn("Notification create error:", nerr);
            // don't fail upload because of notification issue
        }

        return NextResponse.json({ message: "Files uploaded", files: savedFiles }, { status: 200 });
    } catch (err: any) {
        console.error("UPLOAD ERROR:", err);
        return NextResponse.json({ message: "Internal error", error: err.message }, { status: 500 });
    }
}
