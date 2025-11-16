"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwtHelper_1 = require("../helper/jwtHelper");
const responseHandler_1 = require("../utils/responseHandler");
const authenticate = (req, res, next) => {
    var _a;
    try {
        // Read Access Token from HttpOnly Cookie
        const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
        if (!token) {
            (0, responseHandler_1.errorResponse)(res, "Unauthorized: Access token missing", 401);
            return;
        }
        // Verify JWT
        const decoded = (0, jwtHelper_1.verifyAccessToken)(token);
        if (!decoded || !decoded.userId) {
            (0, responseHandler_1.errorResponse)(res, "Unauthorized: Invalid access token", 401);
            return;
        }
        // Attach decoded user data to request
        req.user = {
            userId: decoded.userId,
            iat: decoded.iat,
            exp: decoded.exp,
        };
        next();
    }
    catch (error) {
        console.error("JWT Verification Error:", error.message);
        if ((error === null || error === void 0 ? void 0 : error.name) === "TokenExpiredError") {
            (0, responseHandler_1.errorResponse)(res, "Access token expired", 401);
            return;
        }
        (0, responseHandler_1.errorResponse)(res, "Unauthorized: Invalid or expired token", 401);
    }
};
exports.authenticate = authenticate;
