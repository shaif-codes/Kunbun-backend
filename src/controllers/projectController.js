import { projectModel } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { notFound } from '../utils/error.js';

// Socket.IO instance (will be set from server)
let io;
export const setSocketIO = (socketInstance) => {
    io = socketInstance;
};

export const projectController = {
    // Get all projects
    async getAllProjects(req, res) {
        try {
            const projects = await projectModel.find()
                .populate('members', 'name email')
                .sort({ createdAt: -1 });
            
            if (!projects || projects.length === 0) {
                return notFound(res)("Projects");
            }
            
            return successResponse(res, 200, projects);
        } catch (error) {
            console.error("Error fetching projects:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },

    // Get project by ID
    async getProjectById(req, res) {
        try {
            const project = await projectModel.findById(req.params.id)
                .populate('members', 'name email role');
            
            if (!project) {
                return notFound(res)("Project");
            }
            
            return successResponse(res, 200, project);
        } catch (error) {
            console.error("Error fetching project:", error);
            return errorResponse(res, error, "Internal server error");
        }
    },

    // Create new project
    async createProject(req, res) {
        try {
            const { name, description, members, statusSection } = req.body;
            
            // Check if project with same name already exists
            const existingProject = await projectModel.findOne({ name });
            if (existingProject) {
                return errorResponse(res, null, "Project with this name already exists", 400);
            }

            const newProject = new projectModel({
                name,
                description,
                members,
                statusSection: statusSection || [
                    { status: "To Do", tasks: [] },
                    { status: "In Progress", tasks: [] },
                    { status: "Done", tasks: [] }
                ]
            });

            const savedProject = await newProject.save();
            const populatedProject = await projectModel.findById(savedProject._id)
                .populate('members', 'name email');

            // Emit real-time event
            if (io) {
                io.to(`project_${savedProject._id}`).emit('project_created', {
                    project: populatedProject,
                    createdBy: {
                        id: req.user._id,
                        name: req.user.name,
                        email: req.user.email
                    },
                    timestamp: new Date().toISOString()
                });
            }

            return successResponse(res, populatedProject, "Project created successfully", 201);
        } catch (error) {
            console.error("Error creating project:", error);
            return errorResponse(res, error, "Failed to create project");
        }
    },

    // Update project
    async updateProject(req, res) {
        try {
            const { name, description, members } = req.body;
            const projectId = req.params.id;

            // Check if project exists
            const existingProject = await projectModel.findById(projectId);
            if (!existingProject) {
                return notFound(res)("Project");
            }

            // Check if name is being updated and if it conflicts with another project
            if (name && name !== existingProject.name) {
                const nameConflict = await projectModel.findOne({ 
                    name, 
                    _id: { $ne: projectId } 
                });
                if (nameConflict) {
                    return errorResponse(res, null, "Project with this name already exists", 400);
                }
            }

            const updatedProject = await projectModel.findByIdAndUpdate(
                projectId,
                { 
                    ...(name && { name }),
                    ...(description !== undefined && { description }),
                    ...(members && { members })
                },
                { new: true }
            ).populate('members', 'name email');

            return successResponse(res, updatedProject, "Project updated successfully");
        } catch (error) {
            console.error("Error updating project:", error);
            return errorResponse(res, error, "Failed to update project");
        }
    },

    // Delete project
    async deleteProject(req, res) {
        try {
            const projectId = req.params.id;
            
            const deletedProject = await projectModel.findByIdAndDelete(projectId);
            if (!deletedProject) {
                return notFound(res)("Project");
            }

            return successResponse(res, { message: "Project deleted successfully" });
        } catch (error) {
            console.error("Error deleting project:", error);
            return errorResponse(res, error, "Failed to delete project");
        }
    },

    // Add task to project
    async addTask(req, res) {
        try {
            const { status, task } = req.body;
            const projectId = req.params.id;

            const project = await projectModel.findById(projectId);
            if (!project) {
                return notFound(res)("Project");
            }

            // Find the status section and add the task
            const statusSection = project.statusSection.find(section => section.status === status);
            if (!statusSection) {
                return errorResponse(res, null, "Invalid status section", 400);
            }

            // Set the order for the new task
            task.order = statusSection.tasks.length;
            statusSection.tasks.push(task);

            await project.save();
            
            const updatedProject = await projectModel.findById(projectId)
                .populate('members', 'name email');

            return successResponse(res, updatedProject, "Task added successfully");
        } catch (error) {
            console.error("Error adding task:", error);
            return errorResponse(res, error, "Failed to add task");
        }
    },

    // Update task in project
    async updateTask(req, res) {
        try {
            const { status, taskId, task } = req.body;
            const projectId = req.params.id;

            const project = await projectModel.findById(projectId);
            if (!project) {
                return notFound(res)("Project");
            }

            // Find the status section and task
            const statusSection = project.statusSection.find(section => section.status === status);
            if (!statusSection) {
                return errorResponse(res, null, "Invalid status section", 400);
            }

            const taskIndex = statusSection.tasks.findIndex(t => t._id.toString() === taskId);
            if (taskIndex === -1) {
                return notFound(res)("Task");
            }

            // Update the task while preserving the original order
            statusSection.tasks[taskIndex] = {
                ...statusSection.tasks[taskIndex].toObject(),
                ...task,
                _id: taskId
            };

            await project.save();
            
            const updatedProject = await projectModel.findById(projectId)
                .populate('members', 'name email');

            return successResponse(res, updatedProject, "Task updated successfully");
        } catch (error) {
            console.error("Error updating task:", error);
            return errorResponse(res, error, "Failed to update task");
        }
    },

    // Move task between status sections
    async moveTask(req, res) {
        try {
            const { fromStatus, toStatus, taskId, newOrder } = req.body;
            const projectId = req.params.id;

            const project = await projectModel.findById(projectId);
            if (!project) {
                return notFound(res)("Project");
            }

            // Find source and destination status sections
            const fromSection = project.statusSection.find(section => section.status === fromStatus);
            const toSection = project.statusSection.find(section => section.status === toStatus);
            console.log("From Section:", fromSection);
            console.log("To Section:", toSection);
            if (!fromSection || !toSection) {
                return errorResponse(res, null, "Invalid status section", 400);
            }

            // Find and remove task from source section
            const taskIndex = fromSection.tasks.findIndex(t => t._id.toString() === taskId);
            console.log("Task Index:", taskIndex);
            if (taskIndex === -1) {
                return notFound(res)("Task");
            }

            const task = fromSection.tasks.splice(taskIndex, 1)[0];
            
            // Update task order and add to destination section
            task.order = newOrder || toSection.tasks.length;
            toSection.tasks.splice(task.order, 0, task);

            // Reorder tasks in destination section
            toSection.tasks.forEach((t, index) => {
                t.order = index;
            });

            // Reorder remaining tasks in source section
            fromSection.tasks.forEach((t, index) => {
                t.order = index;
            });

            await project.save();
            
            const updatedProject = await projectModel.findById(projectId)
                .populate('members', 'name email');

            return successResponse(res, updatedProject, "Task moved successfully");
        } catch (error) {
            console.error("Error moving task:", error);
            return errorResponse(res, error, "Failed to move task");
        }
    },

    // Delete task from project
    async deleteTask(req, res) {
        try {
            const { status } = req.query;
            const { taskId } = req.params;
            const projectId = req.params.id;

            if (!status) {
                return errorResponse(res, null, "Status query parameter is required", 400);
            }

            const project = await projectModel.findById(projectId);
            if (!project) {
                return notFound(res)("Project");
            }

            // Find the status section and remove the task
            const statusSection = project.statusSection.find(section => section.status === status);
            if (!statusSection) {
                return errorResponse(res, null, "Invalid status section", 400);
            }

            const taskIndex = statusSection.tasks.findIndex(t => t._id.toString() === taskId);
            if (taskIndex === -1) {
                return notFound(res)("Task");
            }

            statusSection.tasks.splice(taskIndex, 1);

            // Reorder remaining tasks
            statusSection.tasks.forEach((t, index) => {
                t.order = index;
            });

            await project.save();
            
            const updatedProject = await projectModel.findById(projectId)
                .populate('members', 'name email');

            return successResponse(res, updatedProject, "Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            return errorResponse(res, error, "Failed to delete task");
        }
    }
};
