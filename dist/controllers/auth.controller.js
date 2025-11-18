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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileController = exports.logoutController = exports.refreshController = exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("../service/auth.service");
const responseHandler_1 = require("../utils/responseHandler");
const env_config_1 = require("../config/env.config");
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken, refreshToken, user } = yield (0, auth_service_1.register)(req.body, req);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return (0, responseHandler_1.successResponse)(res, "User registered successfully", {
            user
        }, 201);
    }
    catch (err) {
        return (0, responseHandler_1.errorResponse)(res, err.message, 400);
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = yield (0, auth_service_1.login)(email, password, req);
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env_config_1.NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        });
        return (0, responseHandler_1.successResponse)(res, "Login successful", {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        }, 200);
    }
    catch (err) {
        return (0, responseHandler_1.errorResponse)(res, err.message, 400);
    }
});
exports.loginController = loginController;
const refreshController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const tokens = yield (0, auth_service_1.refresh)(refreshToken, req);
        return (0, responseHandler_1.successResponse)(res, "Token refreshed", tokens, 200);
    }
    catch (err) {
        return (0, responseHandler_1.errorResponse)(res, err.message, 401);
    }
});
exports.refreshController = refreshController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        yield (0, auth_service_1.logout)(refreshToken);
        return (0, responseHandler_1.successResponse)(res, "Logged out successfully", null, 200);
    }
    catch (err) {
        return (0, responseHandler_1.errorResponse)(res, err.message, 400);
    }
});
exports.logoutController = logoutController;
const getProfileController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return (0, responseHandler_1.errorResponse)(res, "Unauthorized", 401);
        }
        const user = yield (0, auth_service_1.getProfile)(userId);
        return (0, responseHandler_1.successResponse)(res, "Profile fetched successfully", user, 200);
    }
    catch (error) {
        console.error("Get Profile Error:", error.message);
        return (0, responseHandler_1.errorResponse)(res, error.message || "Failed to fetch profile", 500);
    }
});
exports.getProfileController = getProfileController;
