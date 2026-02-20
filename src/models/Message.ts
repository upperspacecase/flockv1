import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IMessage extends Document {
    matchId: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        matchId: {
            type: Schema.Types.ObjectId,
            ref: "Match",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: { type: String, required: true },
    },
    { timestamps: true }
);

// Index for fetching messages by match, ordered by time
MessageSchema.index({ matchId: 1, createdAt: 1 });

const Message: Model<IMessage> =
    mongoose.models.Message ||
    mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
