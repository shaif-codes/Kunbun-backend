import { authController } from "../controllers/index.js";
import { Router } from "express";
import { validator } from "../middlewares/validator.js";
import { authenticate, authorizeRole } from "../middlewares/auth.js";
import { authSchema } from "../schema/index.js";
import { roleEnums } from "../config/index.js";

const router = Router();

// Firebase signup route
router.post("/verify-user", authenticate, authorizeRole(roleEnums.ADMIN), validator({ body: authSchema.signup }), authController.firebaseSignup);

// unverified sign up
router.post("/unverified-signup", validator({ body: authSchema.unverifiedSignup }), authController.unverifiedSiginUp);

// Firebase login route
router.post("/login", validator({ body: authSchema.login }), authController.firebaseLogin);

// Firebase reset password route
router.get("/reset-password", validator({ query: authSchema.resetPassword }), authController.firebaseResetPassword);

export { router as authRouter };