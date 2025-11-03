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
exports.loginController = exports.registerController = void 0;
const auth_service_1 = require("../service/auth.service");
const responseHandler_1 = require("../utils/responseHandler");
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_service_1.registerUser)(req.body);
        return (0, responseHandler_1.successResponse)(res, "User registered successfully", result, 201);
    }
    catch (err) {
        return (0, responseHandler_1.errorResponse)(res, err.message, 400);
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, auth_service_1.loginUser)(req.body);
        return (0, responseHandler_1.successResponse)(res, "User logged in successfully", result, 200);
    }
    catch (err) {
        return (0, responseHandler_1.errorResponse)(res, err.message, 400);
    }
});
exports.loginController = loginController;
