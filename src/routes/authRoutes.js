import { authController } from "../controllers/index.js";
import { Router } from "express";

const router = Router();
// Firebase signup route
router.post("/signup", authController.firebaseSignup);
// Firebase login route
router.post("/login", authController.firebaseLogin);
// Firebase reset password route
router.get("/reset-password", authController.firebaseResetPassword);

export { router as authRouter };