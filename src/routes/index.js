import express from "express";
import { userRouter } from "./userRoutes.js";
import { authRouter } from "./authRoutes.js";
import { projectRouter } from "./projectRoutes.js";
import { teamRouter } from "./teamRoutes.js";
import { messageRouter } from "./messageRoutes.js";
import emailRouter from "./emailRoutes.js";

const router = express.Router();

router.use("/users", userRouter);

router.use("/auth", authRouter);

router.use("/projects", projectRouter);

router.use("/teams", teamRouter);

router.use("/messages", messageRouter);

router.use("/email", emailRouter);

export default router;
