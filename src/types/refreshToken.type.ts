import { Types } from "mongoose";

export interface IRefreshToken {
    user: Types.ObjectId;
    tokenId: string;
    expiresAt: Date;
    createdAt: Date;
    replacedByTokenId: string | null;
    revoked: boolean;
    ip: string;
    userAgent: string;
}