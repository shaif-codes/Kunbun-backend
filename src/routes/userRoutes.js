import { userController } from "../controllers/index.js";
import { roleEnums } from "../config/index.js";
import { Router } from "express";
import { authenticate, authorizeRole } from "../middlewares/auth.js";
import { validator } from "../middlewares/validator.js";
import { userSchema } from "../schema/index.js";

const router = Router();

router.get('/me',
  authenticate,
  userController.getCurrentUser
);

router.get("/", authenticate, authorizeRole(roleEnums.ADMIN), userController.getAllUsers);

router.get("/:id", authenticate, authorizeRole(roleEnums.ADMIN), validator({ params: userSchema.getUserById }),  userController.getUserById);

router.put(
  "/:id",
  authenticate,
  authorizeRole(roleEnums.ADMIN),
  validator({ body: userSchema.updateUser }),
  userController.updateUser
);

router.delete(
  "/:id",
  authenticate,
  authorizeRole(roleEnums.ADMIN),
  validator({ params: userSchema.deleteUser }),
  userController.deleteUser
);

export { router as userRouter };
