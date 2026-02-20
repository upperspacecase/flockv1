import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Like from "@/models/Like";
import Match from "@/models/Match";
import { computeCompatibility } from "@/lib/matching";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const currentUser = await User.findOne({ clerkId: userId });
        if (!currentUser) {
            return NextResponse.json({ profiles: [] });
        }

        // Get IDs to exclude: self, already liked, already matched
        const likedIds = (
            await Like.find({ liker: currentUser._id }).select("liked").lean()
        ).map((l) => l.liked);

        const matchedIds = (
            await Match.find({
                $or: [{ userA: currentUser._id }, { userB: currentUser._id }],
                status: "active",
            })
                .select("userA userB")
                .lean()
        ).flatMap((m) => [m.userA, m.userB]);

        const excludeIds = [
            currentUser._id,
            ...likedIds,
            ...matchedIds,
        ];

        const candidates = await User.find({
            _id: { $nin: excludeIds },
            hasOnboarded: true,
        }).lean();

        // Score and sort by compatibility
        const scored = candidates
            .map((candidate) => {
                const result = computeCompatibility(currentUser, candidate);
                return {
                    ...candidate,
                    compatibilityScore: result.score,
                    compatibilityBreakdown: result.breakdown,
                };
            })
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

        return NextResponse.json({ profiles: scored });
    } catch (error) {
        console.error("GET /api/users/discover error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
