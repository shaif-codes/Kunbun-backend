import { authController } from "../controllers/index.js";
import { Router } from "express";
import { validator } from "../middlewares/validator.js";
import { authSchema } from "../schema/index.js";

const router = Router();

// Firebase signup route
router.post("/signup", validator({ body: authSchema.signup }), authController.firebaseSignup);

// Firebase login route
router.post("/login", validator({ body: authSchema.login }), authController.firebaseLogin);

// Firebase reset password route
router.get("/reset-password", validator({ query: authSchema.resetPassword }), authController.firebaseResetPassword);

export { router as authRouter };