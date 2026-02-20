import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Message from "@/models/Message";
import Match from "@/models/Match";

export async function GET(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const matchId = searchParams.get("matchId");
        if (!matchId) {
            return NextResponse.json(
                { error: "matchId is required" },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify user is part of this match
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

        const messages = await Message.find({ matchId })
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json({
            messages: messages.map((m) => ({
                _id: m._id,
                text: m.text,
                senderId: m.senderId.toString(),
                createdAt: m.createdAt,
                fromSelf: m.senderId.toString() === currentUser._id.toString(),
            })),
        });
    } catch (error) {
        console.error("GET /api/messages error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { matchId, text } = await request.json();
        if (!matchId || !text?.trim()) {
            return NextResponse.json(
                { error: "matchId and text are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        const currentUser = await User.findOne({ clerkId: userId });
        if (!currentUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify user is part of this match
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

        const message = await Message.create({
            matchId,
            senderId: currentUser._id,
            text: text.trim(),
        });

        return NextResponse.json({
            message: {
                _id: message._id,
                text: message.text,
                senderId: message.senderId.toString(),
                createdAt: message.createdAt,
                fromSelf: true,
            },
        });
    } catch (error) {
        console.error("POST /api/messages error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
