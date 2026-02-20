import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Like from "@/models/Like";
import Match from "@/models/Match";
import { computeCompatibility, pickSpeciesForPair } from "@/lib/matching";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { likedUserId } = await request.json();
        if (!likedUserId) {
            return NextResponse.json(
                { error: "likedUserId is required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const currentUser = await User.findOne({ clerkId: userId });
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const likedUser = await User.findById(likedUserId);
        if (!likedUser) {
            return NextResponse.json(
                { error: "Liked user not found" },
                { status: 404 }
            );
        }

        // Create the like (ignore duplicate errors)
        try {
            await Like.create({
                liker: currentUser._id,
                liked: likedUser._id,
            });
        } catch (err: unknown) {
            if ((err as { code?: number }).code === 11000) {
                // Already liked — ignore
            } else {
                throw err;
            }
        }

        // Check for mutual like
        const mutualLike = await Like.findOne({
            liker: likedUser._id,
            liked: currentUser._id,
        });

        if (mutualLike) {
            // It's a match! Create match record
            const compatibility = computeCompatibility(currentUser, likedUser);
            const species = pickSpeciesForPair(currentUser, likedUser);

            // Check if match already exists
            const existingMatch = await Match.findOne({
                $or: [
                    { userA: currentUser._id, userB: likedUser._id },
                    { userA: likedUser._id, userB: currentUser._id },
                ],
            });

            if (!existingMatch) {
                const match = await Match.create({
                    userA: currentUser._id,
                    userB: likedUser._id,
                    species: {
                        id: species.id,
                        name: species.name,
                        imageEmoji: species.imageEmoji,
                    },
                    compatibilityScore: compatibility.score,
                });

                const populatedMatch = await Match.findById(match._id)
                    .populate("userA")
                    .populate("userB")
                    .lean();

                return NextResponse.json({
                    liked: true,
                    matched: true,
                    match: populatedMatch,
                });
            }
        }

        return NextResponse.json({ liked: true, matched: false });
    } catch (error) {
        console.error("POST /api/likes error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
