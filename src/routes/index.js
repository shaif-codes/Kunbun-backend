import express from "express";
import { userRouter } from "./userRoutes.js";
import { authRouter } from "./authRoutes.js";
import { projectRouter } from "./projectRoutes.js";

const router = express.Router();

router.use("/users", userRouter);

router.use("/auth", authRouter);

router.use("/projects", projectRouter);


export default router;
