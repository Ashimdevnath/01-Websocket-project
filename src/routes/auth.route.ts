import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import { registerSchema, loginSchema } from "../validations/auth.validation";

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getProfileController
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/userAuthorization";

const router = Router();

router.post("/register", validateRequest(registerSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);
router.post("/refresh-token", refreshController);
router.post("/logout", authenticate, logoutController);
router.get("/profile", authenticate, getProfileController);


export default router;
