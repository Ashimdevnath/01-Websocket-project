import { Request, Response } from "express";
import { registerUser, loginUser } from "../service/auth.service";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const registerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await registerUser(req.body);
        return successResponse(res, "User registered successfully", result, 201);
    } catch (err: any) {
        return errorResponse(res, err.message, 400);
    }
};

export const loginController = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await loginUser(req.body);
        return successResponse(res, "User logged in successfully", result, 200);
    } catch (err: any) {
        return errorResponse(res, err.message, 400);
    }
};
