import { userModel } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notFound } from '../utils/error.js';
import { admin } from '../services/firebaseService.js';

export const userController = {
    async getAllUsers(req, res) {
        try {
            const users = await userModel.find().select("-password -firebaseUid");
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
            const user = await userModel.findById(req.params.id).select("-password -firebaseUid");
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
            console.log("Updating user with ID:", req.body);
            const userData = req.body;
            const userId = req.params.id;
            const updatedUser = await userModel.findByIdAndUpdate(
                userId,
                { ...userData },
                { new: true }
            );
            if (!updatedUser) {
                return notFound(res)("User");
            }
            return successResponse(res, updatedUser);
        } catch (error) {
            console.error("Error updating user:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },

    async deleteUser(req, res) {
        try {
            // Check if the user exists before attempting to delete
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return notFound(res)("User");
            }
            // Delete the user from firebase
            await admin.auth().deleteUser(user.firebaseUid);
            const deletedUser = await userModel.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return notFound(res)("User");
            }
            return successResponse(res, { message: "User deleted successfully" });
        } catch (error) {
            console.error("Error deleting user:", error);
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