import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../helper/jwtHelper";
import { errorResponse } from "../utils/responseHandler";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    fullName: string;
    email: string;
    iat?: number;
    exp?: number;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Read Access Token from HttpOnly Cookie
    const token = req.cookies?.accessToken;
    if (!token) {
      errorResponse(res, "Unauthorized: Access token missing", 401);
      return;
    }

    // Verify JWT
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.userId) {
      errorResponse(res, "Unauthorized: Invalid access token", 401);
      return;
    }

    // Attach decoded user data to request
    req.user = {
      userId: decoded.userId,
      fullName: decoded.fullName,
      email: decoded.email,
      iat: decoded.iat,
      exp: decoded.exp,
    };
    next();
  } catch (error: any) {
    console.error("JWT Verification Error:", error.message);

    if (error?.name === "TokenExpiredError") {
      errorResponse(res, "Access token expired", 401);
      return;
    }

    errorResponse(res, "Unauthorized: Invalid or expired token", 401);
  }
};
