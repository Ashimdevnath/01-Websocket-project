"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_config_1.JWT_SECRET, { expiresIn: env_config_1.JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, env_config_1.JWT_SECRET);
};
exports.verifyToken = verifyToken;
