import Joi from "joi";
import { roleEnums } from "../config/index.js";

export const userSchema = {
  createUser: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid(...Object.values(roleEnums))
      .default(roleEnums.MEMBER),
    teamId: Joi.string().optional(),
  }),
  updateUser: Joi.object({
    name: Joi.string().optional(),
    role: Joi.string().valid("USER", "ADMIN", "SUPER_ADMIN").optional(),
    teamId: Joi.string().optional(),
    darkTheme: Joi.boolean().optional(),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
