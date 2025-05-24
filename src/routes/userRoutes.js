import { userController } from "../controllers/index.js";
import { roleEnums } from "../config/index.js";
import { Router } from "express";
import { authorizeRole } from "../middlewares/auth.js";
import { validator } from "../middlewares/validator.js";
import { userSchema } from "../schema/index.js";

const router = Router();

router.get("/", authorizeRole(roleEnums.ADMIN), userController.getAllUsers);

router.get("/:id", authorizeRole(roleEnums.ADMIN), userController.getUserById);

router.put(
  "/:id",
  authorizeRole(roleEnums.ADMIN),
  validator({ body: userSchema.updateUser }),
  userController.updateUser
);
router.delete(
  "/:id",
  authorizeRole(roleEnums.ADMIN),
  userController.deleteUser
);

export { router as userRouter };
