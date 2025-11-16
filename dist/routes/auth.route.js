"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../middleware/validateRequest"));
const auth_validation_1 = require("../validations/auth.validation");
const auth_controller_1 = require("../controllers/auth.controller");
const userAuthorization_1 = require("../middleware/userAuthorization");
const router = (0, express_1.Router)();
router.post("/register", (0, validateRequest_1.default)(auth_validation_1.registerSchema), auth_controller_1.registerController);
router.post("/login", (0, validateRequest_1.default)(auth_validation_1.loginSchema), auth_controller_1.loginController);
router.post("/refresh-token", auth_controller_1.refreshController);
router.post("/logout", userAuthorization_1.authenticate, auth_controller_1.logoutController);
router.get("/profile", userAuthorization_1.authenticate, auth_controller_1.getProfileController);
exports.default = router;
