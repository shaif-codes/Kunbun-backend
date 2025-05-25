import { messageModel, teamModel } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notFound } from '../utils/error.js';

export const messageController = {
    // Get all messages for a team
    async getTeamMessages(req, res) {
        try {
            const { teamId } = req.params;
            const { page = 1, limit = 50 } = req.query;

            // Check if team exists
            const team = await teamModel.findById(teamId);
            if (!team) {
                return notFound(res)("Team");
            }

            // Check if user is a member of the team
            if (!team.adminId.includes(req.user._id)) {
                return errorResponse(res, null, "You are not a member of this team", 403);
            }

            const skip = (page - 1) * limit;
            const messages = await messageModel.find({ teamId })
                .populate('senderId', 'name email')
                .sort({ timestamp: 1 })
                .limit(parseInt(limit))
                .skip(skip);

            const total = await messageModel.countDocuments({ teamId });

            return successResponse(res, {
                messages,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            }, "Messages retrieved successfully");
        } catch (error) {
            console.error("Error fetching team messages:", error);
            return errorResponse(res, error, "Failed to fetch messages");
        }
    },

    // Create new message
    async createMessage(req, res) {
        try {
            const { content, teamId } = req.body;
            const senderId = req.user._id;

            // Check if team exists
            const team = await teamModel.findById(teamId);
            if (!team) {
                return notFound(res)("Team");
            }

            // Check if user is a member of the team
            if (!team.adminId.includes(senderId)) {
                return errorResponse(res, null, "You are not a member of this team", 403);
            }

            const newMessage = new messageModel({
                content,
                senderId,
                teamId,
                timestamp: new Date()
            });

            const savedMessage = await newMessage.save();
            const populatedMessage = await messageModel.findById(savedMessage._id)
                .populate('senderId', 'name email');

            // Emit real-time message event
            if (req.app && req.app.get('io')) {
                req.app.get('io').to(`team_${teamId}`).emit('new_message', {
                    message: populatedMessage,
                    sender: {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email
                    },
                    timestamp: new Date().toISOString()
                });
            }

            return successResponse(res, populatedMessage, "Message sent successfully", 201);
        } catch (error) {
            console.error("Error creating message:", error);
            return errorResponse(res, error, "Failed to send message");
        }
    },

    // Update message (only sender can update)
    async updateMessage(req, res) {
        try {
            const { messageId } = req.params;
            const { content } = req.body;
            const userId = req.user._id;

            const message = await messageModel.findById(messageId);
            if (!message) {
                return notFound(res)("Message");
            }

            // Check if user is the sender
            if (message.senderId.toString() !== userId.toString()) {
                return errorResponse(res, null, "You can only edit your own messages", 403);
            }

            // Update message
            message.content = content;
            message.updatedAt = new Date();
            await message.save();

            const updatedMessage = await messageModel.findById(messageId)
                .populate('senderId', 'name email');

            return successResponse(res, updatedMessage, "Message updated successfully");
        } catch (error) {
            console.error("Error updating message:", error);
            return errorResponse(res, error, "Failed to update message");
        }
    },

    // Delete message (sender or team admin can delete)
    async deleteMessage(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user._id;
            const userRole = req.user.role;

            const message = await messageModel.findById(messageId);
            if (!message) {
                return notFound(res)("Message");
            }

            // Get team to check if user is admin
            const team = await teamModel.findById(message.teamId);
            if (!team) {
                return notFound(res)("Team");
            }

            // Check if user can delete (sender, team admin, or system admin)
            const canDelete = message.senderId.toString() === userId.toString() || 
                             team.adminId.includes(userId) ||
                             userRole === 'ADMIN';

            if (!canDelete) {
                return errorResponse(res, null, "You don't have permission to delete this message", 403);
            }

            await messageModel.findByIdAndDelete(messageId);

            return successResponse(res, { message: "Message deleted successfully" });
        } catch (error) {
            console.error("Error deleting message:", error);
            return errorResponse(res, error, "Failed to delete message");
        }
    },

    // Get message by ID
    async getMessageById(req, res) {
        try {
            const { messageId } = req.params;
            const userId = req.user._id;

            const message = await messageModel.findById(messageId)
                .populate('senderId', 'name email')
                .populate('teamId', 'name');

            if (!message) {
                return notFound(res)("Message");
            }

            // Check if user is a member of the team
            const team = await teamModel.findById(message.teamId._id);
            if (!team.adminId.includes(userId)) {
                return errorResponse(res, null, "You are not a member of this team", 403);
            }

            return successResponse(res, message, "Message retrieved successfully");
        } catch (error) {
            console.error("Error fetching message:", error);
            return errorResponse(res, error, "Failed to fetch message");
        }
    },

    // Search messages in a team
    async searchMessages(req, res) {
        try {
            const { teamId } = req.params;
            const { query, page = 1, limit = 20 } = req.query;
            const userId = req.user._id;

            if (!query) {
                return errorResponse(res, null, "Search query is required", 400);
            }

            // Check if team exists and user is a member
            const team = await teamModel.findById(teamId);
            if (!team) {
                return notFound(res)("Team");
            }

            if (!team.adminId.includes(userId)) {
                return errorResponse(res, null, "You are not a member of this team", 403);
            }

            const skip = (page - 1) * limit;
            const searchRegex = new RegExp(query, 'i');

            const messages = await messageModel.find({
                teamId,
                content: { $regex: searchRegex }
            })
                .populate('senderId', 'name email')
                .sort({ timestamp: -1 })
                .limit(parseInt(limit))
                .skip(skip);

            const total = await messageModel.countDocuments({
                teamId,
                content: { $regex: searchRegex }
            });

            return successResponse(res, {
                messages,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                },
                query
            }, "Search results retrieved successfully");
        } catch (error) {
            console.error("Error searching messages:", error);
            return errorResponse(res, error, "Failed to search messages");
        }
    }
};
