import { teamModel } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notFound } from '../utils/error.js';

export const teamController = {
    // Get all teams
    async getAllTeams(req, res) {
        try {
            const teams = await teamModel.find()
                .populate('adminId', 'name email role')
                .sort({ createdAt: -1 });
            
            if (!teams || teams.length === 0) {
                return notFound(res)("Teams");
            }
            
            return successResponse(res, 200, teams);
        } catch (error) {
            console.error("Error fetching teams:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },

    // Get team by ID
    async getTeamById(req, res) {
        try {
            const team = await teamModel.findById(req.params.id)
                .populate('adminId', 'name email role');
            
            if (!team) {
                return notFound(res)("Team");
            }
            
            return successResponse(res, 200, team);
        } catch (error) {
            console.error("Error fetching team:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },

    // Create new team
    async createTeam(req, res) {
        try {
            const { name, description, adminId } = req.body;
            
            // Check if team with same name already exists
            const existingTeam = await teamModel.findOne({ name });
            if (existingTeam) {
                return errorResponse(res, null, "Team with this name already exists", 400);
            }

            const newTeam = new teamModel({
                name,
                description,
                adminId
            });

            const savedTeam = await newTeam.save();
            const populatedTeam = await teamModel.findById(savedTeam._id)
                .populate('adminId', 'name email role');

            return successResponse(res, populatedTeam, "Team created successfully", 201);
        } catch (error) {
            console.error("Error creating team:", error);
            return errorResponse(res, error, "Failed to create team");
        }
    },

    // Update team
    async updateTeam(req, res) {
        try {
            const { name, description, adminId } = req.body;
            const teamId = req.params.id;

            // Check if team exists
            const existingTeam = await teamModel.findById(teamId);
            if (!existingTeam) {
                return notFound(res)("Team");
            }

            // Check if name is being updated and if it conflicts with another team
            if (name && name !== existingTeam.name) {
                const nameConflict = await teamModel.findOne({ 
                    name, 
                    _id: { $ne: teamId } 
                });
                if (nameConflict) {
                    return errorResponse(res, null, "Team with this name already exists", 400);
                }
            }

            const updatedTeam = await teamModel.findByIdAndUpdate(
                teamId,
                { 
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(adminId && { adminId })
                },
                { new: true }
            ).populate('adminId', 'name email role');

            return successResponse(res, updatedTeam, "Team updated successfully");
        } catch (error) {
            console.error("Error updating team:", error);
            return errorResponse(res, error, "Failed to update team");
        }
    },

    // Delete team
    async deleteTeam(req, res) {
        try {
            const teamId = req.params.id;
            
            const deletedTeam = await teamModel.findByIdAndDelete(teamId);
            if (!deletedTeam) {
                return notFound(res)("Team");
            }

            return successResponse(res, { message: "Team deleted successfully" });
        } catch (error) {
            console.error("Error deleting team:", error);
            return errorResponse(res, error, "Failed to delete team");
        }
    },

    // Add members to team (add users to adminId array)
    async addMembers(req, res) {
        try {
            const { userIds } = req.body;
            const teamId = req.params.id;

            const team = await teamModel.findById(teamId);
            if (!team) {
                return notFound(res)("Team");
            }

            // Filter out users who are already members
            const newMembers = userIds.filter(userId => !team.adminId.includes(userId));
            
            if (newMembers.length === 0) {
                return errorResponse(res, null, "All provided users are already members of this team", 400);
            }

            // Add new members to the team
            team.adminId.push(...newMembers);
            await team.save();

            const updatedTeam = await teamModel.findById(teamId)
                .populate('adminId', 'name email role');

            const addedCount = newMembers.length;
            const skippedCount = userIds.length - newMembers.length;
            
            let message = `${addedCount} member(s) added successfully`;
            if (skippedCount > 0) {
                message += `, ${skippedCount} user(s) were already members`;
            }

            return successResponse(res, updatedTeam, message);
        } catch (error) {
            console.error("Error adding members:", error);
            return errorResponse(res, error, "Failed to add members");
        }
    },

    // Remove member from team
    async removeMember(req, res) {
        try {
            const { userId } = req.body;
            const teamId = req.params.id;

            const team = await teamModel.findById(teamId);
            if (!team) {
                return notFound(res)("Team");
            }

            // Check if user is a member
            const memberIndex = team.adminId.indexOf(userId);
            if (memberIndex === -1) {
                return errorResponse(res, null, "User is not a member of this team", 400);
            }

            // Don't allow removing the last admin
            if (team.adminId.length === 1) {
                return errorResponse(res, null, "Cannot remove the last admin from the team", 400);
            }

            team.adminId.splice(memberIndex, 1);
            await team.save();

            const updatedTeam = await teamModel.findById(teamId)
                .populate('adminId', 'name email role');

            return successResponse(res, updatedTeam, "Member removed successfully");
        } catch (error) {
            console.error("Error removing member:", error);
            return errorResponse(res, error, "Failed to remove member");
        }
    },

    // Get teams where user is a member
    async getUserTeams(req, res) {
        try {
            const userId = req.user._id;
            
            const teams = await teamModel.find({ adminId: userId })
                .populate('adminId', 'name email role')
                .sort({ createdAt: -1 });
            
            return successResponse(res, teams, "User teams retrieved successfully");
        } catch (error) {
            console.error("Error fetching user teams:", error);
            return errorResponse(res, error, "Failed to fetch user teams");
        }
    }
};
