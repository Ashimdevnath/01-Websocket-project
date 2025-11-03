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
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
let isConnected = false;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    if (isConnected) {
        console.log("✅ Using existing MongoDB connection.");
        return;
    }
    try {
        mongoose_1.default.set("strictQuery", true);
        const db = yield mongoose_1.default.connect(env_config_1.MONGODB_URI, {
            dbName: env_config_1.MONGODB_DBNAME,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log("🚀 Connected to MongoDB!");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
    mongoose_1.default.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB Disconnected! Attempting to reconnect...");
        (0, exports.connectDB)();
    });
    mongoose_1.default.connection.on("reconnected", () => {
        console.log("�� MongoDB reconnected!");
    });
});
exports.connectDB = connectDB;
