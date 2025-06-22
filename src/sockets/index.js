import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { userModel } from '../models/index.js';

// Socket.IO authentication middleware
export const authenticateSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await userModel.findById(decoded.id).select('-password -firebaseUid');
        
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }

        socket.user = user;
        next();
    } catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};

// Main socket handler
export const handleSocket = (io) => {
    // Use authentication middleware
    io.use(authenticateSocket);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.user.name} (${socket.user.email})`);

        // Join user to their personal room
        socket.join(`user_${socket.user._id}`);

        // Handle joining project rooms
        socket.on('join_project', (projectId) => {
            socket.join(`project_${projectId}`);
            console.log(`User ${socket.user.name} joined project ${projectId}`);
            
            // Notify other project members
            socket.to(`project_${projectId}`).emit('user_joined_project', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                projectId
            });
        });

        // Handle leaving project rooms
        socket.on('leave_project', (projectId) => {
            socket.leave(`project_${projectId}`);
            console.log(`User ${socket.user.name} left project ${projectId}`);
            
            // Notify other project members
            socket.to(`project_${projectId}`).emit('user_left_project', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                projectId
            });
        });

        // Handle joining team rooms
        socket.on('join_team', (teamId) => {
            socket.join(`team_${teamId}`);
            console.log(`User ${socket.user.name} joined team ${teamId}`);
            
            // Notify other team members
            socket.to(`team_${teamId}`).emit('user_joined_team', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                teamId
            });
        });

        // Handle leaving team rooms
        socket.on('leave_team', (teamId) => {
            socket.leave(`team_${teamId}`);
            console.log(`User ${socket.user.name} left team ${teamId}`);
            
            // Notify other team members
            socket.to(`team_${teamId}`).emit('user_left_team', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                teamId
            });
        });

        // Handle real-time task updates
        socket.on('task_updated', (data) => {
            console.log(`Task updated by ${socket.user.name}:`, data);
            
            // Broadcast to all project members except sender
            socket.to(`project_${data.projectId}`).emit('task_updated', {
                ...data,
                updatedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle real-time task creation
        socket.on('task_created', (data) => {
            console.log(`Task created by ${socket.user.name}:`, data);
            
            // Broadcast to all project members except sender
            socket.to(`project_${data.projectId}`).emit('task_created', {
                ...data,
                createdBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle real-time task deletion
        socket.on('task_deleted', (data) => {
            console.log(`Task deleted by ${socket.user.name}:`, data);
            
            // Broadcast to all project members except sender
            socket.to(`project_${data.projectId}`).emit('task_deleted', {
                ...data,
                deletedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle real-time task movement
        socket.on('task_moved', (data) => {
            console.log(`Task moved by ${socket.user.name}:`, data);
            
            // Broadcast to all project members except sender
            socket.to(`project_${data.projectId}`).emit('task_moved', {
                ...data,
                movedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle typing indicators for team chat
        socket.on('typing_start', (data) => {
            socket.to(`team_${data.teamId}`).emit('user_typing', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name
                },
                teamId: data.teamId
            });
        });

        socket.on('typing_stop', (data) => {
            socket.to(`team_${data.teamId}`).emit('user_stopped_typing', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name
                },
                teamId: data.teamId
            });
        });

        // Handle team messages (will be implemented with message CRUD)
        socket.on('send_message', (data) => {
            console.log(`Message sent by ${socket.user.name}:`, data);
            
            // Broadcast to all team members except sender
            socket.to(`team_${data.teamId}`).emit('new_message', {
                ...data,
                sender: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle project updates
        socket.on('project_updated', (data) => {
            console.log(`Project updated by ${socket.user.name}:`, data);
            
            // Broadcast to all project members except sender
            socket.to(`project_${data.projectId}`).emit('project_updated', {
                ...data,
                updatedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle team updates
        socket.on('team_updated', (data) => {
            console.log(`Team updated by ${socket.user.name}:`, data);
            
            // Broadcast to all team members except sender
            socket.to(`team_${data.teamId}`).emit('team_updated', {
                ...data,
                updatedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle member additions/removals
        socket.on('member_added', (data) => {
            console.log(`Member added by ${socket.user.name}:`, data);
            
            // Broadcast to all team members
            io.to(`team_${data.teamId}`).emit('member_added', {
                ...data,
                addedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        socket.on('member_removed', (data) => {
            console.log(`Member removed by ${socket.user.name}:`, data);
            
            // Broadcast to all team members
            io.to(`team_${data.teamId}`).emit('member_removed', {
                ...data,
                removedBy: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Handle user status updates
        socket.on('status_update', (status) => {
            console.log(`${socket.user.name} status: ${status}`);
            
            // Broadcast status to all user's teams and projects
            socket.broadcast.emit('user_status_changed', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                status,
                timestamp: new Date().toISOString()
            });
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.user.name} (${socket.user.email})`);
            
            // Broadcast user offline status
            socket.broadcast.emit('user_offline', {
                user: {
                    id: socket.user._id,
                    name: socket.user.name,
                    email: socket.user.email
                },
                timestamp: new Date().toISOString()
            });
        });

        // Send welcome message
        socket.emit('connected', {
            message: `Welcome ${socket.user.name}! You are connected to the Kunban platform.`,
            user: {
                id: socket.user._id,
                name: socket.user.name,
                email: socket.user.email,
                role: socket.user.role
            },
            timestamp: new Date().toISOString()
        });
    });
};

export default handleSocket;
