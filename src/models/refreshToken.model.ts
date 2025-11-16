import mongoose, { Schema } from "mongoose";
import { IRefreshToken } from "../types/refreshToken.type";

const refreshTokenSchema = new Schema<IRefreshToken>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User", required: true
    },
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replacedByTokenId: {
        type: String,
        default: ""
    },
    revoked: {
        type: Boolean,
        default: false
    },
    ip: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
});

export const RefreshTokenModel = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);