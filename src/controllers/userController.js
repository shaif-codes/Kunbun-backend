import { userModel } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notFound } from '../utils/error.js';

export const userController = {
    async getAllUsers(req, res) {
        try {
            const users = await userModel.find().select("-password");
            if(!users || users.length === 0) {
                return notFound(res)("Users");
            }
            return successResponse(res, 200, users);
        } catch (error) {
            return errorResponse(res, error, "Internal server error");
        }
    },

    async getUserById(req, res) {
        try {
            const user = await userModel.findById(req.params.id).select("-password");
            if (!user) {
                return notFound(res)("User");
            }
            return successResponse(res, user);
        } catch (error) {
            return errorResponse(res, error, "Internal server error");
        }
    },
    async updateUser(req, res) {
        try {
            const { email, name, password, role } = req.body;
            const updatedUser = await userModel.findByIdAndUpdate(
                req.params.id,
                { email, name, password, role },
                { new: true }
            );
            if (!updatedUser) {
                return notFound(res)("User");
            }
            return successResponse(res, updatedUser);
        } catch (error) {
            return errorResponse(res, error, "Internal server error");
        }
    },

    async deleteUser(req, res) {
        try {
            const deletedUser = await userModel.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return notFound(res)("User");
            }
            return successResponse(res, { message: "User deleted successfully" });
        } catch (error) {
            return errorResponse(res, error, "Internal server error");
        }
    },

    async changeTheam(req, res) {
        try {
            const { darkTheme } = req.body;
            const user = await userModel.findByIdAndUpdate(
                req.user._id,
                { darkTheme },
                { new: true }
            );
            if (!user) {
                return notFound(res)("User");
            }
            return successResponse(res, user);
        } catch (error) {
            return errorResponse(res, error, "Internal server error");
        }
    }
};