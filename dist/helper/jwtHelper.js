"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.signRefreshToken = exports.signAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const uuid_1 = require("uuid");
// Helper function to ensure secret is defined
const getSecret = (secret, defaultSecret) => {
    if (!secret || secret === '') {
        console.warn('Using default secret key. In production, please set a strong secret in your environment variables.');
        return defaultSecret;
    }
    return secret;
};
const signAccessToken = (payload) => {
    const secret = getSecret(env_config_1.ACCESS_SECRET, "your-access-secret-key");
    const options = { expiresIn: env_config_1.ACCESS_EXPIRES };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.signAccessToken = signAccessToken;
const signRefreshToken = (payload) => {
    const secret = getSecret(env_config_1.REFRESH_SECRET, "your-refresh-secret-key");
    const jti = payload.jti || (0, uuid_1.v4)();
    const options = { expiresIn: env_config_1.REFRESH_EXPIRES };
    return {
        token: jsonwebtoken_1.default.sign(Object.assign(Object.assign({}, payload), { jti }), secret, options),
        jti,
    };
};
exports.signRefreshToken = signRefreshToken;
const verifyAccessToken = (token) => {
    const secret = getSecret(env_config_1.ACCESS_SECRET, 'your-access-secret-key');
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    const secret = getSecret(env_config_1.REFRESH_SECRET, 'your-refresh-secret-key');
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyRefreshToken = verifyRefreshToken;
