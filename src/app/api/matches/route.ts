import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Match from "@/models/Match";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const currentUser = await User.findOne({ clerkId: userId });
        if (!currentUser) {
            return NextResponse.json({ matches: [] });
        }

        const matches = await Match.find({
            $or: [{ userA: currentUser._id }, { userB: currentUser._id }],
            status: "active",
        })
            .populate("userA")
            .populate("userB")
            .sort({ createdAt: -1 })
            .lean();

        // Normalize: always put the "other" user in a consistent field
        const normalized = matches.map((m) => {
            const isUserA = m.userA._id.toString() === currentUser._id.toString();
            return {
                ...m,
                otherUser: isUserA ? m.userB : m.userA,
            };
        });

        return NextResponse.json({ matches: normalized });
    } catch (error) {
        console.error("GET /api/matches error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
