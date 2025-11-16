import bcrypt from "bcryptjs";
import { UserModel } from "../models/auth.model";
import { RefreshTokenModel } from "../models/refreshToken.model";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../helper/jwtHelper"
import { Types } from "mongoose";

export const register = async (data: any, req: any) => {
  const { fullName, email, password } = data;

  const existing = await UserModel.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const hashed = await bcrypt.hash(password, 10);

  const user = await UserModel.create({
    fullName,
    email,
    password: hashed,
  });

  // Access Token
  const accessToken = signAccessToken({ userId: user._id });

  // Refresh Token + JTI
  const { token: refreshToken, jti } = signRefreshToken({
    userId: user._id.toString(),
  });

  await RefreshTokenModel.create({
    user: user._id,
    tokenId: jti,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const safeUser = user.toObject();
  delete safeUser.password;

  return { accessToken, refreshToken, user: safeUser };
};


export const login = async (
    email: string,
    password: string,
    req: any
) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    // Access Token
    const accessToken = signAccessToken({ userId: user._id });

    // Refresh Token
    const { token: refreshToken, jti } = signRefreshToken({
        userId: user._id.toString(),
    });

    await RefreshTokenModel.create({
        user: user._id,
        tokenId: jti,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });

    return { accessToken, refreshToken, user };
};

export const refresh = async (oldRefreshToken: string, req: any) => {
    if (!oldRefreshToken) throw new Error("Refresh token missing");

    // Verify token
    const decoded = verifyRefreshToken<{ userId: string; jti: string }>(
        oldRefreshToken
    );
    console.log("decoded",decoded);

    // Find token in DB
    const storedToken = await RefreshTokenModel.findOne({
        tokenId: decoded.jti,
        revoked: false,
    });

    if (!storedToken) throw new Error("Token revoked or invalid");

    // Revoke old token
    storedToken.revoked = true;
    storedToken.replacedByTokenId = decoded.jti;
    await storedToken.save();

    // Generate new tokens
    const accessToken = signAccessToken({ userId: decoded.userId });

    const { token: newRefreshToken, jti } = signRefreshToken({
        userId: decoded.userId,
    });

    await RefreshTokenModel.create({
        user: new Types.ObjectId(decoded.userId),
        tokenId: jti,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const logout = async (refreshToken: string) => {
    if (!refreshToken) throw new Error("Refresh token required");

    const decoded = verifyRefreshToken<{ jti: string }>(refreshToken);

    await RefreshTokenModel.findOneAndUpdate(
        { tokenId: decoded.jti },
        { revoked: true }
    );

    return true;
};

export const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId).lean();

  if (!user) throw new Error("User not found");

  delete user.password; 
  return user;
};