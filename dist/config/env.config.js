"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.ALLOWED_ORIGINS = exports.JWT_EXPIRES_IN = exports.JWT_SECRET = exports.MONGODB_DBNAME = exports.MONGODB_URI = exports.PORT = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.PORT = process.env.PORT || 8080;
exports.MONGODB_URI = process.env.MONGODB_URI || "";
exports.MONGODB_DBNAME = process.env.MONGODB_DBNAME || "";
exports.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
exports.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
exports.ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : [];
exports.NODE_ENV = process.env.NODE_ENV || "development";
