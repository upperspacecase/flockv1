import mongoose, { Schema, Document, Model } from "mongoose";

// --- Sub-schemas ---

const MigrationStopSchema = new Schema(
    {
        country: { type: String, required: true },
        countryCode: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
        year: { type: Number },
        season: { type: String },
    },
    { _id: false }
);

// --- User Document Interface ---

export interface IUser extends Document {
    clerkId: string;
    name: string;
    age: number;
    photo: string;
    bio?: string;
    birthCountry: {
        country: string;
        countryCode: string;
        lat: number;
        lng: number;
    };
    grewUp: {
        country: string;
        countryCode: string;
        lat: number;
        lng: number;
    }[];
    recentMigrations: {
        country: string;
        countryCode: string;
        lat: number;
        lng: number;
        year?: number;
        season?: string;
    }[];
    futurePlans: {
        country: string;
        countryCode: string;
        lat: number;
        lng: number;
    }[];
    currentLocation: {
        country: string;
        countryCode: string;
        lat: number;
        lng: number;
    };
    flexibility: number;
    lookingFor: "romantic" | "friends" | "both";
    hasOnboarded: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// --- Schema ---

const UserSchema = new Schema<IUser>(
    {
        clerkId: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        photo: { type: String, default: "" },
        bio: { type: String, default: "" },
        birthCountry: { type: MigrationStopSchema, required: true },
        grewUp: { type: [MigrationStopSchema], default: [] },
        recentMigrations: { type: [MigrationStopSchema], default: [] },
        futurePlans: { type: [MigrationStopSchema], default: [] },
        currentLocation: { type: MigrationStopSchema, required: true },
        flexibility: { type: Number, default: 0.5, min: 0, max: 1 },
        lookingFor: {
            type: String,
            enum: ["romantic", "friends", "both"],
            default: "both",
        },
        hasOnboarded: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
