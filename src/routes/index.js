import express from "express";
import { userRouter } from "./userRoutes.js";
import { authRouter } from "./authRoutes.js";

const router = express.Router();

router.use("/users", userRouter);

router.use("/auth", authRouter);
// router.get("/auth", (req, res) => {
//   res.status(200).json({ message: "Auth route is under construction" });
// });

export default router;
