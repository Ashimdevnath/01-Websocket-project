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
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_model_1 = require("../models/auth.model");
const jwtHelper_1 = require("../helper/jwtHelper");
const registerUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield auth_model_1.UserModel.findOne({ email: data.email.toLowerCase() });
    if (existing)
        throw new Error("Email already registered");
    const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
    const user = yield auth_model_1.UserModel.create({
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        password: hashedPassword,
    });
    const token = (0, jwtHelper_1.generateToken)({ id: user._id, email: user.email });
    return {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        token,
    };
});
exports.registerUser = registerUser;
const loginUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user)
        throw new Error("Invalid credentials");
    const isMatch = yield bcryptjs_1.default.compare(data.password, user.password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    const token = (0, jwtHelper_1.generateToken)({ id: user._id, fullName: user.fullName, email: user.email });
    return {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        token,
    };
});
exports.loginUser = loginUser;
