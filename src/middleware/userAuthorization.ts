import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../helper/jwtHelper";
import { errorResponse } from "../utils/responseHandler";

export interface AuthenticatedRequest extends Request {
  user?: any; // You can strongly type this if you know your token payload structure
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      errorResponse(res, "Unauthorized: Token missing or invalid format", 401);
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      errorResponse(res, "Unauthorized: Invalid token", 401);
      return;
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    errorResponse(res, "Unauthorized: Invalid token", 401);
  }
};