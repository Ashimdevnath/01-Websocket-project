import { Request, Response } from "express";
import { register, login, refresh, logout, getProfile } from "../service/auth.service";
import { errorResponse, successResponse } from "../utils/responseHandler";
import { AuthenticatedRequest } from "../middleware/userAuthorization";
import { NODE_ENV } from "../config/env.config";

export const registerController = async (req: Request, res: Response) => {
    try {
        const { accessToken, refreshToken, user } = await register(req.body, req);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24, 
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        });

        return successResponse(res, "User registered successfully", {
            user
        }, 201);

    } catch (err: any) {
        return errorResponse(res, err.message, 400);
    }
};


export const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken, user } =
            await login(email, password, req);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: NODE_ENV === "development", 
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24, 
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,

            secure: NODE_ENV === "development",
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7, 
        });

        return successResponse(res, "Login successful", {
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        }, 200);
    } catch (err: any) {
        return errorResponse(res, err.message, 400);
    }
};

export const refreshController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        const tokens = await refresh(refreshToken, req);
        return successResponse(res, "Token refreshed", tokens, 200);
    } catch (err: any) {
        return errorResponse(res, err.message, 401);
    }
};

export const logoutController = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;
        await logout(refreshToken);
        return successResponse(res, "Logged out successfully", null, 200);
    } catch (err: any) {
        return errorResponse(res, err.message, 400);
    }
};

export const getProfileController = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }

        const user = await getProfile(userId);

        return successResponse(res, "Profile fetched successfully", user, 200);
    } catch (error: any) {
        console.error("Get Profile Error:", error.message);
        return errorResponse(res, error.message || "Failed to fetch profile", 500);
    }
};
