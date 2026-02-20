import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Match from "@/models/Match";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { matchId, amount } = await request.json();
        if (!matchId || !amount || amount <= 0) {
            return NextResponse.json(
                { error: "matchId and positive amount are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const currentUser = await User.findOne({ clerkId: userId });
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const match = await Match.findById(matchId);
        if (!match) {
            return NextResponse.json({ error: "Match not found" }, { status: 404 });
        }

        const isParticipant =
            match.userA.toString() === currentUser._id.toString() ||
            match.userB.toString() === currentUser._id.toString();
        if (!isParticipant) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        match.contributedAmount = (match.contributedAmount || 0) + amount;
        await match.save();

        return NextResponse.json({
            contributedAmount: match.contributedAmount,
        });
    } catch (error) {
        console.error("POST /api/contributions error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
