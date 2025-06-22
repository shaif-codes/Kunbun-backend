import { userModel } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notFound } from '../utils/error.js';
import { admin } from '../services/firebaseService.js';
import emailService from '../services/emailService.js';

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
    },
    async getCurrentUser(req, res) {
        try {
            console.log("hellow I am here")
            const user = await userModel.findById(req.user._id).select("-password -firebaseUid");
            if (!user) {
                return notFound(res)("User");
            }
            return successResponse(res, user);
        } catch (error) {
            console.error("Error fetching current user:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },
    listUnvierifiedUsers: async (req, res) => {
        try {
            console.log("Fetching unverified users");
            const users = await userModel.find({ isVerified: false }).select("-password -firebaseUid");
            if (!users || users.length === 0) {
                return notFound(res)("Unverified Users");
            }
            return successResponse(res, users);
        } catch (error) {
            console.error("Error fetching unverified users:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },
    verifyBulkUsers: async (req, res) => {
        try {
            const { userIds } = req.body;
            if (!Array.isArray(userIds) || userIds.length === 0) {
                return errorResponse(res, null, "Please provide an array of user IDs", 400);
            }

            const updatedUsers = await userModel.updateMany(
                { _id: { $in: userIds } },
                { isVerified: true },
                { new: true },
                { session: monogTransaction }
            );

            if (updatedUsers.nModified === 0) {
                return notFound(res)("Users");
            }

            // regist user on firebase and send welcome email to each user
            const users = await userModel.find({ _id: { $in: userIds }, isVerified: true }).select("email name");
            const emailPromises = users.map(user => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const newPassword = Math.random().toString(36).slice(-8); // Generate a random password
                        // register user with email and password in Firebase
                        await firebaseService.createUserWithEmailAndPassword({
                            email: user.email,
                            password: newPassword
                        });
                        await emailService.sendWelcomeEmail(user.email, user.name, newPassword);
                        resolve();
                    } catch (error) {
                        console.error(`Failed to send welcome email to ${user.email}:`, error);
                        errorList.push({ email: user.email, error: error.message });
                        reject(error);
                    }
                });
            })

            await Promise.all(emailPromises)
                .then(() => console.log("Welcome emails sent successfully"))
                .catch(error => console.error("Error sending welcome emails:", error));

            // If any errors occurred during email sending, return them
            if (errorList.length > 0) {
                return errorResponse(res, errorList, "Some users could not be verified due to some errors");
            }

            return successResponse(res, {}, "Users verified successfully");
        } catch (error) {
            console.error("Error verifying users:", error);
            return errorResponse(res, error, "Internal server error");
        }
    }
};