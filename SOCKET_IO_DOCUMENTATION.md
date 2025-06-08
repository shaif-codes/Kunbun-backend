# Socket.IO Frontend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Connection Setup](#connection-setup)
4. [Room Management](#room-management)
5. [Task Management Events](#task-management-events)
6. [Team Communication](#team-communication)
7. [User Presence & Status](#user-presence--status)
8. [Error Handling](#error-handling)
9. [Frontend Integration Examples](#frontend-integration-examples)
10. [Event Reference](#event-reference)

## Overview

The Kunban platform uses Socket.IO for real-time collaboration features including:
- **Real-time task updates** across project boards
- **Team chat** with typing indicators
- **User presence tracking** and status updates
- **Live notifications** for project/team changes
- **Room-based communication** for projects and teams

**Server URL:** `http://localhost:3030` (development)

## Authentication

All Socket.IO connections require JWT authentication. The token must be provided during connection.

### Token Requirements
- Valid JWT token obtained from `/api/auth/login` endpoint
- Token must be passed in the `auth` object during connection
- Token expires based on server configuration (default: 24 hours)

## Connection Setup

### Basic Connection (JavaScript)

```javascript
import { io } from 'socket.io-client';

// Get JWT token from your auth system
const token = localStorage.getItem('authToken'); // or your token storage method

const socket = io('http://localhost:3030', {
    auth: {
        token: token
    },
    autoConnect: false // Connect manually after token validation
});

// Connect to server
socket.connect();

// Handle connection events
socket.on('connect', () => {
    console.log('Connected to Kunban server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

// Welcome message with user info
socket.on('connected', (data) => {
    console.log('Welcome message:', data.message);
    console.log('User info:', data.user);
});
```

### React Hook Example

```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (token) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!token) return;

        const newSocket = io('http://localhost:3030', {
            auth: { token }
        });

        newSocket.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected');
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [token]);

    return { socket, isConnected };
};
```

## Room Management

Users can join/leave project and team rooms to receive targeted real-time updates.

### Project Rooms

```javascript
// Join a project room
socket.emit('join_project', projectId);

// Leave a project room
socket.emit('leave_project', projectId);

// Listen for users joining/leaving
socket.on('user_joined_project', (data) => {
    console.log(`${data.user.name} joined project ${data.projectId}`);
    // Update UI to show user joined
});

socket.on('user_left_project', (data) => {
    console.log(`${data.user.name} left project ${data.projectId}`);
    // Update UI to show user left
});
```

### Team Rooms

```javascript
// Join a team room
socket.emit('join_team', teamId);

// Leave a team room
socket.emit('leave_team', teamId);

// Listen for users joining/leaving
socket.on('user_joined_team', (data) => {
    console.log(`${data.user.name} joined team ${data.teamId}`);
    // Update UI to show user joined
});

socket.on('user_left_team', (data) => {
    console.log(`${data.user.name} left team ${data.teamId}`);
    // Update UI to show user left
});
```

## Task Management Events

Real-time task updates are broadcast to all project members automatically.

### Sending Task Events

```javascript
// When a task is created
socket.emit('task_created', {
    projectId: 'project_id_here',
    task: {
        id: 'task_id',
        title: 'New Task',
        description: 'Task description',
        status: 'todo', // 'todo', 'in-progress', 'done'
        assignedTo: 'user_id',
        priority: 'medium',
        dueDate: '2024-12-31'
    }
});

// When a task is updated
socket.emit('task_updated', {
    projectId: 'project_id_here',
    taskId: 'task_id',
    updates: {
        title: 'Updated Task Title',
        description: 'Updated description',
        priority: 'high'
    }
});

// When a task is moved between columns
socket.emit('task_moved', {
    projectId: 'project_id_here',
    taskId: 'task_id',
    fromStatus: 'todo',
    toStatus: 'in-progress',
    newOrder: 2
});

// When a task is deleted
socket.emit('task_deleted', {
    projectId: 'project_id_here',
    taskId: 'task_id'
});
```

### Receiving Task Events

```javascript
// Listen for task creation
socket.on('task_created', (data) => {
    console.log(`Task created by ${data.createdBy.name}:`, data.task);
    // Add task to your UI
    addTaskToBoard(data.task);
});

// Listen for task updates
socket.on('task_updated', (data) => {
    console.log(`Task updated by ${data.updatedBy.name}:`, data.updates);
    // Update task in your UI
    updateTaskInBoard(data.taskId, data.updates);
});

// Listen for task movement
socket.on('task_moved', (data) => {
    console.log(`Task moved by ${data.movedBy.name}`);
    // Move task in your UI
    moveTaskInBoard(data.taskId, data.fromStatus, data.toStatus, data.newOrder);
});

// Listen for task deletion
socket.on('task_deleted', (data) => {
    console.log(`Task deleted by ${data.deletedBy.name}`);
    // Remove task from your UI
    removeTaskFromBoard(data.taskId);
});
```

## Team Communication

Real-time messaging and typing indicators for team collaboration.

### Sending Messages

```javascript
// Send a message to team
socket.emit('send_message', {
    teamId: 'team_id_here',
    message: 'Hello team!',
    messageType: 'text' // 'text', 'file', 'image'
});
```

### Receiving Messages

```javascript
// Listen for new messages
socket.on('new_message', (data) => {
    console.log(`New message from ${data.sender.name}:`, data.message);
    // Add message to chat UI
    addMessageToChat({
        id: data.id,
        sender: data.sender,
        message: data.message,
        timestamp: data.timestamp,
        teamId: data.teamId
    });
});
```

### Typing Indicators

```javascript
// Start typing
const handleTypingStart = (teamId) => {
    socket.emit('typing_start', { teamId });
};

// Stop typing
const handleTypingStop = (teamId) => {
    socket.emit('typing_stop', { teamId });
};

// Listen for typing indicators
socket.on('user_typing', (data) => {
    console.log(`${data.user.name} is typing in team ${data.teamId}`);
    // Show typing indicator in UI
    showTypingIndicator(data.user, data.teamId);
});

socket.on('user_stopped_typing', (data) => {
    console.log(`${data.user.name} stopped typing`);
    // Hide typing indicator in UI
    hideTypingIndicator(data.user, data.teamId);
});

// Example implementation with debouncing
let typingTimer;
const handleMessageInput = (teamId, isTyping) => {
    if (isTyping) {
        socket.emit('typing_start', { teamId });
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            socket.emit('typing_stop', { teamId });
        }, 2000); // Stop typing after 2 seconds of inactivity
    } else {
        socket.emit('typing_stop', { teamId });
        clearTimeout(typingTimer);
    }
};
```

## User Presence & Status

Track online/offline status and custom user statuses.

### Status Updates

```javascript
// Update user status
socket.emit('status_update', 'available'); // 'available', 'busy', 'away', 'offline'

// Listen for user status changes
socket.on('user_status_changed', (data) => {
    console.log(`${data.user.name} is now ${data.status}`);
    // Update user status in UI
    updateUserStatus(data.user.id, data.status);
});

// Listen for user going offline
socket.on('user_offline', (data) => {
    console.log(`${data.user.name} went offline`);
    // Update user status to offline in UI
    updateUserStatus(data.user.id, 'offline');
});
```

### Project & Team Updates

```javascript
// Listen for project updates
socket.on('project_updated', (data) => {
    console.log(`Project updated by ${data.updatedBy.name}`);
    // Update project in UI
    updateProject(data.projectId, data.updates);
});

// Listen for team updates
socket.on('team_updated', (data) => {
    console.log(`Team updated by ${data.updatedBy.name}`);
    // Update team in UI
    updateTeam(data.teamId, data.updates);
});

// Listen for member additions/removals
socket.on('member_added', (data) => {
    console.log(`${data.member.name} added to team by ${data.addedBy.name}`);
    // Add member to team UI
    addMemberToTeam(data.teamId, data.member);
});

socket.on('member_removed', (data) => {
    console.log(`${data.member.name} removed from team by ${data.removedBy.name}`);
    // Remove member from team UI
    removeMemberFromTeam(data.teamId, data.memberId);
});
```

## Error Handling

```javascript
// Connection errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error.message);
    
    if (error.message.includes('Authentication error')) {
        // Token is invalid, redirect to login
        redirectToLogin();
    }
});

// General error handling
socket.on('error', (error) => {
    console.error('Socket error:', error);
    // Show error message to user
    showErrorMessage(error.message);
});

// Reconnection handling
socket.on('reconnect', (attemptNumber) => {
    console.log(`Reconnected after ${attemptNumber} attempts`);
    // Re-join rooms if needed
    rejoinRooms();
});

socket.on('reconnect_failed', () => {
    console.error('Failed to reconnect');
    // Show connection failed message
    showConnectionFailedMessage();
});
```

## Frontend Integration Examples

### React Kanban Board Component

```javascript
import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const KanbanBoard = ({ projectId, authToken }) => {
    const { socket, isConnected } = useSocket(authToken);
    const [tasks, setTasks] = useState({ todo: [], 'in-progress': [], done: [] });

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Join project room
        socket.emit('join_project', projectId);

        // Listen for task events
        socket.on('task_created', (data) => {
            setTasks(prev => ({
                ...prev,
                [data.task.status]: [...prev[data.task.status], data.task]
            }));
        });

        socket.on('task_updated', (data) => {
            setTasks(prev => {
                const newTasks = { ...prev };
                Object.keys(newTasks).forEach(status => {
                    newTasks[status] = newTasks[status].map(task =>
                        task.id === data.taskId ? { ...task, ...data.updates } : task
                    );
                });
                return newTasks;
            });
        });

        socket.on('task_moved', (data) => {
            setTasks(prev => {
                const newTasks = { ...prev };
                const task = newTasks[data.fromStatus].find(t => t.id === data.taskId);
                if (task) {
                    // Remove from old status
                    newTasks[data.fromStatus] = newTasks[data.fromStatus].filter(t => t.id !== data.taskId);
                    // Add to new status
                    task.status = data.toStatus;
                    newTasks[data.toStatus].splice(data.newOrder, 0, task);
                }
                return newTasks;
            });
        });

        socket.on('task_deleted', (data) => {
            setTasks(prev => {
                const newTasks = { ...prev };
                Object.keys(newTasks).forEach(status => {
                    newTasks[status] = newTasks[status].filter(task => task.id !== data.taskId);
                });
                return newTasks;
            });
        });

        return () => {
            socket.emit('leave_project', projectId);
            socket.off('task_created');
            socket.off('task_updated');
            socket.off('task_moved');
            socket.off('task_deleted');
        };
    }, [socket, isConnected, projectId]);

    const handleTaskMove = (taskId, fromStatus, toStatus, newOrder) => {
        socket.emit('task_moved', {
            projectId,
            taskId,
            fromStatus,
            toStatus,
            newOrder
        });
    };

    // Render your kanban board...
};
```

### React Team Chat Component

```javascript
import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const TeamChat = ({ teamId, authToken }) => {
    const { socket, isConnected } = useSocket(authToken);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [typingUsers, setTypingUsers] = useState([]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Join team room
        socket.emit('join_team', teamId);

        // Listen for messages
        socket.on('new_message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        // Listen for typing indicators
        socket.on('user_typing', (data) => {
            setTypingUsers(prev => [...prev.filter(u => u.id !== data.user.id), data.user]);
        });

        socket.on('user_stopped_typing', (data) => {
            setTypingUsers(prev => prev.filter(u => u.id !== data.user.id));
        });

        return () => {
            socket.emit('leave_team', teamId);
            socket.off('new_message');
            socket.off('user_typing');
            socket.off('user_stopped_typing');
        };
    }, [socket, isConnected, teamId]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('send_message', {
                teamId,
                message: newMessage,
                messageType: 'text'
            });
            setNewMessage('');
        }
    };

    const handleTyping = (value) => {
        setNewMessage(value);
        if (value) {
            socket.emit('typing_start', { teamId });
        } else {
            socket.emit('typing_stop', { teamId });
        }
    };

    // Render your chat interface...
};
```

## Event Reference

### Client → Server Events

| Event | Data | Description |
|-------|------|-------------|
| `join_project` | `projectId` | Join a project room |
| `leave_project` | `projectId` | Leave a project room |
| `join_team` | `teamId` | Join a team room |
| `leave_team` | `teamId` | Leave a team room |
| `task_created` | `{ projectId, task }` | Notify of new task creation |
| `task_updated` | `{ projectId, taskId, updates }` | Notify of task updates |
| `task_moved` | `{ projectId, taskId, fromStatus, toStatus, newOrder }` | Notify of task movement |
| `task_deleted` | `{ projectId, taskId }` | Notify of task deletion |
| `send_message` | `{ teamId, message, messageType }` | Send message to team |
| `typing_start` | `{ teamId }` | Start typing indicator |
| `typing_stop` | `{ teamId }` | Stop typing indicator |
| `status_update` | `status` | Update user status |

### Server → Client Events

| Event | Data | Description |
|-------|------|-------------|
| `connected` | `{ message, user, timestamp }` | Welcome message on connection |
| `user_joined_project` | `{ user, projectId }` | User joined project room |
| `user_left_project` | `{ user, projectId }` | User left project room |
| `user_joined_team` | `{ user, teamId }` | User joined team room |
| `user_left_team` | `{ user, teamId }` | User left team room |
| `task_created` | `{ task, createdBy, timestamp, projectId }` | Task was created |
| `task_updated` | `{ taskId, updates, updatedBy, timestamp, projectId }` | Task was updated |
| `task_moved` | `{ taskId, fromStatus, toStatus, newOrder, movedBy, timestamp, projectId }` | Task was moved |
| `task_deleted` | `{ taskId, deletedBy, timestamp, projectId }` | Task was deleted |
| `new_message` | `{ message, sender, timestamp, teamId }` | New team message |
| `user_typing` | `{ user, teamId }` | User started typing |
| `user_stopped_typing` | `{ user, teamId }` | User stopped typing |
| `user_status_changed` | `{ user, status, timestamp }` | User status changed |
| `user_offline` | `{ user, timestamp }` | User went offline |
| `project_updated` | `{ projectId, updates, updatedBy, timestamp }` | Project was updated |
| `team_updated` | `{ teamId, updates, updatedBy, timestamp }` | Team was updated |
| `member_added` | `{ teamId, member, addedBy, timestamp }` | Member added to team |
| `member_removed` | `{ teamId, memberId, removedBy, timestamp }` | Member removed from team |

### Connection Events

| Event | Description |
|-------|-------------|
| `connect` | Successfully connected to server |
| `disconnect` | Disconnected from server |
| `connect_error` | Connection failed (usually auth issues) |
| `reconnect` | Successfully reconnected |
| `reconnect_failed` | Failed to reconnect |

## Best Practices

1. **Always check for socket connection** before emitting events
2. **Clean up event listeners** in component unmount/cleanup
3. **Handle authentication errors** gracefully
4. **Implement reconnection logic** for better UX
5. **Debounce typing indicators** to avoid spam
6. **Cache and sync with REST API** for offline support
7. **Use rooms efficiently** - only join rooms you need
8. **Handle errors gracefully** and provide user feedback

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check if JWT token is valid and not expired
   - Ensure token is passed correctly in auth object

2. **Events Not Received**
   - Verify you've joined the correct room
   - Check if socket is connected
   - Ensure event listeners are set up before emitting

3. **Multiple Event Listeners**
   - Always clean up listeners in component unmount
   - Use `socket.off()` to remove specific listeners

4. **Connection Issues**
   - Check server is running on correct port
   - Verify CORS settings if connecting from different domain
   - Check network connectivity

### Testing Your Integration

Use the provided testing interface at `/socket-test.html` to:
- Test authentication
- Verify room joining/leaving
- Test all event types
- Debug connection issues

For production deployment, update the server URL in your socket configuration.
