# Kunban Backend

A modular Node.js backend for a Team Collaboration Platform with real-time features.

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.IO (Real-time communication)
- JWT Auth
- Joi Validation
- Firebase Authentication

## Features ✨
- 🔐 **Firebase Authentication** - Secure backend auth with JWT
- 👥 **User Management** - Complete CRUD with role-based access
- 📋 **Project Management** - Kanban board with task management
- 🤝 **Team Collaboration** - Multi-admin teams with member management
- 💬 **Real-time Messaging** - Team chat with Socket.IO
- 🔄 **Live Updates** - Real-time task updates and notifications
- 🔍 **Message Search** - Full-text search in team messages
- ⚡ **WebSocket Events** - Live collaboration features

## Socket.IO Real-time Features

### Authentication
Socket connections require JWT token authentication via `socket.handshake.auth.token`.

### Available Events

**Connection Events:**
- `connected` - Welcome message on connection
- `user_joined_project` / `user_left_project` - Project room management
- `user_joined_team` / `user_left_team` - Team room management

**Project Collaboration:**
- `task_created` - Real-time task creation
- `task_updated` - Live task modifications
- `task_moved` - Kanban board drag & drop
- `task_deleted` - Task removal notifications
- `project_updated` - Project changes

**Team Communication:**
- `new_message` - Real-time chat messages
- `user_typing` / `user_stopped_typing` - Typing indicators
- `member_added` / `member_removed` - Team membership changes
- `team_updated` - Team information updates

**User Status:**
- `user_status_changed` - Online/offline status
- `user_offline` - Disconnection notifications

### Usage Example
```javascript
// Frontend connection
const socket = io('http://localhost:3030', {
  auth: { token: 'your-jwt-token' }
});

// Join project room
socket.emit('join_project', 'projectId123');

// Listen for real-time task updates
socket.on('task_updated', (data) => {
  console.log('Task updated:', data);
});

// Send message to team
socket.emit('send_message', {
  teamId: 'teamId123',
  content: 'Hello team!'
});
```

## Authentication Approach

### Firebase Backend Authentication
We implement Firebase authentication entirely on the backend for better security and control:

**Signup Flow:**
1. Frontend sends `{ email, password, name }` to `/api/auth/signup`
2. Backend creates Firebase user using Admin SDK
3. User data saved to MongoDB with `firebaseUid`
4. Returns user data with JWT token

**Login Flow:**
1. Frontend sends `{ email, password }` to `/api/auth/login`
2. Backend authenticates with Firebase Client SDK
3. Retrieves user from MongoDB using `firebaseUid`
4. Returns user data with JWT token

**Password Reset:**
1. Frontend calls `/api/auth/reset-password?email=user@example.com`
2. Backend sends reset email via Firebase
3. User resets password through Firebase email link

**Benefits:**
- All Firebase logic handled server-side
- Simplified frontend (just email/password)
- Centralized authentication control
- MongoDB stores additional user data

## User CRUD Operations

All user management endpoints require authentication and admin role authorization.

**Get All Users**
- `GET /api/users` - Retrieve all users (admin only)

**Get User by ID**
- `GET /api/users/:id` - Get specific user details (admin only)

**Update User**
- `PUT /api/users/:id` - Update user information (admin only)
- Body: `{ name, email, role, isActive }`

**Delete User**
- `DELETE /api/users/:id` - Delete user from both MongoDB and Firebase (admin only)

**Change Theme**
- `PUT /api/users/theme` - Toggle user's dark theme preference (authenticated user)
- Body: `{ darkTheme: boolean }`

## Project CRUD Operations

**Get All Projects**
- `GET /api/projects` - Retrieve all projects with member details (authenticated users)

**Get Project by ID**
- `GET /api/projects/:id` - Get specific project with populated members (authenticated users)

**Create Project**
- `POST /api/projects` - Create new project (managers and admins only)
- Body: `{ name, description, members: [teamMemberIds] }`

**Update Project**
- `PUT /api/projects/:id` - Update project information (managers and admins only)
- Body: `{ name, description, members }`

**Delete Project**
- `DELETE /api/projects/:id` - Delete project permanently (admins only)

**Task Management within Projects**
- `POST /api/projects/:id/tasks` - Add task to project
  - Body: `{ status: "todo|in-progress|done", task: { title, description, order } }`
- `PUT /api/projects/:id/tasks` - Update existing task
  - Body: `{ status, taskId, task: { title, description, order } }`
- `PUT /api/projects/:id/tasks/move` - Move task between status columns
  - Body: `{ fromStatus, toStatus, taskId, newOrder }`
- `DELETE /api/projects/:id/tasks/:taskId?status=todo` - Delete task from project

## Team CRUD Operations

**Get All Teams**
- `GET /api/teams` - Retrieve all teams with admin details (authenticated users)

**Get User's Teams**
- `GET /api/teams/my-teams` - Get teams where current user is a member (authenticated users)

**Get Team by ID**
- `GET /api/teams/:id` - Get specific team with populated admins (authenticated users)

**Create Team**
- `POST /api/teams` - Create new team (managers and admins only)
- Body: `{ name, description, adminId: [userIds] }`

**Update Team**
- `PUT /api/teams/:id` - Update team information (managers and admins only)
- Body: `{ name, description, adminId }`

**Delete Team**
- `DELETE /api/teams/:id` - Delete team permanently (admins only)

**Team Member Management**
- `POST /api/teams/:id/members` - Add multiple members to team (managers and admins only)
  - Body: `{ userIds: [userId1, userId2, ...] }`
- `DELETE /api/teams/:id/members` - Remove member from team (managers and admins only)
  - Body: `{ userId }`

## Message CRUD Operations

**Get Team Messages**
- `GET /api/messages/teams/:teamId` - Get paginated team messages (team members only)
- Query params: `?page=1&limit=50`

**Search Messages**
- `GET /api/messages/teams/:teamId/search` - Search messages in team (team members only)
- Query params: `?query=searchTerm&page=1&limit=20`

**Get Message by ID**
- `GET /api/messages/:messageId` - Get specific message details (team members only)

**Send Message**
- `POST /api/messages` - Send message to team (team members only)
- Body: `{ content, teamId }`

**Update Message**
- `PUT /api/messages/:messageId` - Update message content (sender only)
- Body: `{ content }`

**Delete Message**
- `DELETE /api/messages/:messageId` - Delete message (sender, team admin, or system admin only)

### Message Features
- **Real-time Delivery**: Messages are instantly delivered via Socket.IO
- **Pagination**: Efficient message loading with pagination
- **Search**: Full-text search across team messages
- **Permissions**: Role-based message management
- **Timestamps**: Automatic message timestamping
- **User Population**: Messages include sender details

## Setup
1. Copy `.env.example` to `.env` and fill in your values.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

## Scripts
- `npm run dev` — Start with nodemon
- `npm start` — Start production server

## Folder Structure
- `src/config` — Environment/configuration
- `src/models` — Mongoose models
- `src/controllers` — Route controllers
- `src/routes` — Express routers
- `src/middlewares` — Auth, error, validation
- `src/services` — Business logic
- `src/utils` — Helpers/utilities
- `src/sockets` — Socket.IO handlers
- `src/schema` - validation schema