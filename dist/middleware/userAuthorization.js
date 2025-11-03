"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwtHelper_1 = require("../helper/jwtHelper");
const responseHandler_1 = require("../utils/responseHandler");
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            (0, responseHandler_1.errorResponse)(res, "Unauthorized: Token missing or invalid format", 401);
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = (0, jwtHelper_1.verifyToken)(token);
        if (!decoded) {
            (0, responseHandler_1.errorResponse)(res, "Unauthorized: Invalid token", 401);
            return;
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("JWT verification error:", error);
        (0, responseHandler_1.errorResponse)(res, "Unauthorized: Invalid token", 401);
    }
};
exports.authenticate = authenticate;
