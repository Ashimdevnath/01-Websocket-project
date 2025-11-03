"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const responseHandler_1 = require("../utils/responseHandler");
// Route imports
const auth_route_1 = __importDefault(require("./auth.route"));
const registerRoutes = (app) => {
    const router = (0, express_1.Router)();
    // All /api/v1/ routes
    router.use("/auth", auth_route_1.default);
    // 404 fallback for all unmatched routes
    // Use router.use() instead of router.all()
    router.use((_req, res) => {
        (0, responseHandler_1.errorResponse)(res, "Route Not Found!", 404);
    });
    // Mount router under versioned base path
    app.use("/api/v1/", router);
};
exports.default = registerRoutes;
