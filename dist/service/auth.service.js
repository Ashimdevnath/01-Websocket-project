"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.logout = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = require("../models/auth.model");
const refreshToken_model_1 = require("../models/refreshToken.model");
const jwtHelper_1 = require("../helper/jwtHelper");
const mongoose_1 = require("mongoose");
const register = (data, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = data;
    const existing = yield auth_model_1.UserModel.findOne({ email });
    if (existing)
        throw new Error("Email already exists");
    const hashed = yield bcryptjs_1.default.hash(password, 10);
    const user = yield auth_model_1.UserModel.create({
        fullName,
        email,
        password: hashed,
    });
    // Access Token
    const accessToken = (0, jwtHelper_1.signAccessToken)({
        userId: user._id,
        fullName: user.fullName,
        email: user.email
    });
    // Refresh Token + JTI
    const { token: refreshToken, jti } = (0, jwtHelper_1.signRefreshToken)({
        userId: user._id.toString(),
    });
    yield refreshToken_model_1.RefreshTokenModel.create({
        user: user._id,
        tokenId: jti,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    const safeUser = user.toObject();
    delete safeUser.password;
    return { accessToken, refreshToken, user: safeUser };
});
exports.register = register;
const login = (email, password, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email });
    if (!user)
        throw new Error("Invalid email or password");
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error("Invalid email or password");
    // Access Token
    const accessToken = (0, jwtHelper_1.signAccessToken)({
        userId: user._id,
        fullName: user.fullName,
        email: user.email
    });
    // Refresh Token
    const { token: refreshToken, jti } = (0, jwtHelper_1.signRefreshToken)({
        userId: user._id.toString(),
    });
    yield refreshToken_model_1.RefreshTokenModel.create({
        user: user._id,
        tokenId: jti,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    return { accessToken, refreshToken, user };
});
exports.login = login;
const refresh = (oldRefreshToken, req) => __awaiter(void 0, void 0, void 0, function* () {
    if (!oldRefreshToken)
        throw new Error("Refresh token missing");
    // Verify token
    const decoded = (0, jwtHelper_1.verifyRefreshToken)(oldRefreshToken);
    console.log("decoded", decoded);
    // Find token in DB
    const storedToken = yield refreshToken_model_1.RefreshTokenModel.findOne({
        tokenId: decoded.jti,
        revoked: false,
    });
    if (!storedToken)
        throw new Error("Token revoked or invalid");
    // Revoke old token
    storedToken.revoked = true;
    storedToken.replacedByTokenId = decoded.jti;
    yield storedToken.save();
    // Generate new tokens
    const accessToken = (0, jwtHelper_1.signAccessToken)({ userId: decoded.userId });
    const { token: newRefreshToken, jti } = (0, jwtHelper_1.signRefreshToken)({
        userId: decoded.userId,
    });
    yield refreshToken_model_1.RefreshTokenModel.create({
        user: new mongoose_1.Types.ObjectId(decoded.userId),
        tokenId: jti,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
    });
    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
});
exports.refresh = refresh;
const logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken)
        throw new Error("Refresh token required");
    const decoded = (0, jwtHelper_1.verifyRefreshToken)(refreshToken);
    yield refreshToken_model_1.RefreshTokenModel.findOneAndUpdate({ tokenId: decoded.jti }, { revoked: true });
    return true;
});
exports.logout = logout;
const getProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findById(userId).lean();
    if (!user)
        throw new Error("User not found");
    delete user.password;
    return user;
});
exports.getProfile = getProfile;
