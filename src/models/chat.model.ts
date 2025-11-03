// src/modules/auth/auth.model.ts
import mongoose, { Schema } from "mongoose";
import { IChat } from "../types/chat.type";

const chatSchema = new Schema<IChat>(
    {
        senderId: {
            type: String,
            required: true
        },
        receiverId: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        isDelivered: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            enum: ["text", "image", "file", "audio", "video"],
            default: "text",
        },
        mediaUrl: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const ChatModel = mongoose.model<IChat>("Chat", chatSchema);
