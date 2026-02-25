import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ clerkId: userId }).lean();

        if (!user) {
            return NextResponse.json({ user: null });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("GET /api/users/me error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        await dbConnect();

        // Auto-populate name from Clerk if not provided
        if (!body.name) {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(userId);
            const fullName = [clerkUser.firstName, clerkUser.lastName]
                .filter(Boolean)
                .join(" ");
            if (fullName) {
                body.name = fullName;
            }
        }

        // Check if this user already exists in the DB
        const existingUser = await User.findOne({ clerkId: userId });

        if (existingUser) {
            // Existing user — safe to do a partial update (e.g. name/bio/photos only)
            const user = await User.findOneAndUpdate(
                { clerkId: userId },
                { $set: { ...body } },
                { new: true, runValidators: false }
            ).lean();
            return NextResponse.json({ user });
        }

        // New user — must include migration data for required fields
        // Provide sensible defaults if not present (e.g. profile creation before onboarding saved)
        const defaultStop = {
            country: "Unknown",
            countryCode: "XX",
            lat: 0,
            lng: 0,
        };

        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                $set: {
                    ...body,
                    clerkId: userId,
                    hasOnboarded: !!(body.birthCountry && body.currentLocation),
                    birthCountry: body.birthCountry || defaultStop,
                    currentLocation: body.currentLocation || defaultStop,
                },
            },
            { upsert: true, new: true, runValidators: true }
        ).lean();

        return NextResponse.json({ user });
    } catch (error) {
        console.error("PUT /api/users/me error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
