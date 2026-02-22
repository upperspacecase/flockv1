import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMatch extends Document {
    userA: Types.ObjectId;
    userB: Types.ObjectId;
    species: {
        id: string;
        name: string;
        imageLabel: string;
    };
    compatibilityScore: number;
    contributedAmount: number;
    status: "active" | "unmatched";
    createdAt: Date;
    updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
    {
        userA: { type: Schema.Types.ObjectId, ref: "User", required: true },
        userB: { type: Schema.Types.ObjectId, ref: "User", required: true },
        species: {
            id: { type: String, required: true },
            name: { type: String, required: true },
            imageLabel: { type: String, required: true },
        },
        compatibilityScore: { type: Number, default: 0 },
        contributedAmount: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["active", "unmatched"],
            default: "active",
        },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate matches
MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

const Match: Model<IMatch> =
    mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);

export default Match;
