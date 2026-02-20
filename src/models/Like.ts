import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ILike extends Document {
    liker: Types.ObjectId;
    liked: Types.ObjectId;
    createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
    {
        liker: { type: Schema.Types.ObjectId, ref: "User", required: true },
        liked: { type: Schema.Types.ObjectId, ref: "User", required: true },
    },
    { timestamps: true }
);

// Prevent duplicate likes
LikeSchema.index({ liker: 1, liked: 1 }, { unique: true });
// Fast lookup for "who liked me"
LikeSchema.index({ liked: 1 });

const Like: Model<ILike> =
    mongoose.models.Like || mongoose.model<ILike>("Like", LikeSchema);

export default Like;
