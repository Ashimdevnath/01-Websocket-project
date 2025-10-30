import { Router, type Application, type Request, type Response } from "express";
import { errorResponse } from "../utils/responseHandler";

// Route imports
import auth from "./auth.route";

const registerRoutes = (app: Application) => {
    const router = Router();

    // All /api/v1/ routes
    router.use("/auth", auth);

    // 404 fallback for all unmatched routes
    // Use router.use() instead of router.all()
    router.use((_req: Request, res: Response) => {
        errorResponse(res, "Route Not Found!", 404);
    });

    // Mount router under versioned base path
    app.use("/api/v1/", router);
};

export default registerRoutes;