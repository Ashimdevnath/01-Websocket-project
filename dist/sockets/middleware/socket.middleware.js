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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSocketAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../../config/env.config");
const registerSocketAuth = (io) => {
    io.use((socket, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            // HandShake Token Check   
            const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = socket.handshake.query) === null || _b === void 0 ? void 0 : _b.token);
            if (!token) {
                return next(new Error("Unauthorized: Token missing"));
            }
            // Verify Token and Set User Data
            const payload = jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
            socket.data.user = {
                id: payload.id,
                fullName: payload.fullName,
                email: payload.email,
            };
            // Carrue User Data to Next Middleware
            return next();
        }
        catch (err) {
            return next(new Error("Unauthorized"));
        }
    }));
};
exports.registerSocketAuth = registerSocketAuth;
