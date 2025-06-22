import Joi from "joi";
import { roleEnums } from "../config/index.js";

export const userSchema = {
  updateUser: Joi.object({
    name: Joi.string().optional(),
    role: Joi.string().valid(...Object.values(roleEnums)).optional(),
    teamId: Joi.string().optional(),
    darkTheme: Joi.boolean().optional(),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  verifyBulkUsers: Joi.object({
    userIds: Joi.array().items(Joi.string().required()).required(),
  }),
  deleteUser: Joi.object({
    id: Joi.string().required()
  }),
  getUserById: Joi.object({
    id: Joi.string().required()
  })
};
