"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.registerSchema), auth_controller_1.registerController);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.loginSchema), auth_controller_1.loginController);
exports.default = router;
