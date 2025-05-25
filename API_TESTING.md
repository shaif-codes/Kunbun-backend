# API Testing Guide

This guide provides examples for testing all API endpoints using curl or any HTTP client.

## Base URL
```
http://localhost:3030/api
```

## Authentication

### 1. Sign Up
```bash
curl -X POST http://localhost:3030/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "ADMIN"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3030/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

Save the returned JWT token for authenticated requests.

## User Management (Admin Only)

### Get All Users
```bash
curl -X GET http://localhost:3030/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User by ID
```bash
curl -X GET http://localhost:3030/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update User
```bash
curl -X PUT http://localhost:3030/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "role": "MANAGER"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3030/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Team Management

### Create Team
```bash
curl -X POST http://localhost:3030/api/teams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Development Team",
    "description": "Frontend and Backend developers",
    "adminId": ["USER_ID_1", "USER_ID_2"]
  }'
```

### Get All Teams
```bash
curl -X GET http://localhost:3030/api/teams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get User's Teams
```bash
curl -X GET http://localhost:3030/api/teams/my-teams \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Team
```bash
curl -X PUT http://localhost:3030/api/teams/TEAM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Team Name",
    "description": "Updated description"
  }'
```

### Add Multiple Members to Team
```bash
curl -X POST http://localhost:3030/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["USER_ID_1", "USER_ID_2", "USER_ID_3"]
  }'
```

### Remove Member from Team
```bash
curl -X DELETE http://localhost:3030/api/teams/TEAM_ID/members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID"
  }'
```

## Project Management

### Create Project
```bash
curl -X POST http://localhost:3030/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "E-commerce App",
    "description": "Building a modern e-commerce platform",
    "members": ["USER_ID_1", "USER_ID_2"]
  }'
```

### Get All Projects
```bash
curl -X GET http://localhost:3030/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Project by ID
```bash
curl -X GET http://localhost:3030/api/projects/PROJECT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Add Task to Project
```bash
curl -X POST http://localhost:3030/api/projects/PROJECT_ID/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "todo",
    "task": {
      "title": "Set up authentication",
      "description": "Implement JWT authentication with Firebase",
      "order": 0
    }
  }'
```

### Update Task
```bash
curl -X PUT http://localhost:3030/api/projects/PROJECT_ID/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "todo",
    "taskId": "TASK_ID",
    "task": {
      "title": "Updated task title",
      "description": "Updated description",
      "order": 0
    }
  }'
```

### Move Task Between Statuses
```bash
curl -X PUT http://localhost:3030/api/projects/PROJECT_ID/tasks/move \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fromStatus": "todo",
    "toStatus": "in-progress",
    "taskId": "TASK_ID",
    "newOrder": 1
  }'
```

### Delete Task
```bash
curl -X DELETE "http://localhost:3030/api/projects/PROJECT_ID/tasks/TASK_ID?status=todo" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Message Management

### Send Message
```bash
curl -X POST http://localhost:3030/api/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello team! How is everyone doing?",
    "teamId": "TEAM_ID"
  }'
```

### Get Team Messages
```bash
curl -X GET "http://localhost:3030/api/messages/teams/TEAM_ID?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Search Messages
```bash
curl -X GET "http://localhost:3030/api/messages/teams/TEAM_ID/search?query=hello&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update Message
```bash
curl -X PUT http://localhost:3030/api/messages/MESSAGE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated message content"
  }'
```

### Delete Message
```bash
curl -X DELETE http://localhost:3030/api/messages/MESSAGE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Socket.IO Testing

### JavaScript Client Example
```javascript
// Include socket.io-client in your HTML or install via npm
const socket = io('http://localhost:3030', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Connection events
socket.on('connected', (data) => {
  console.log('Connected:', data);
});

// Join a project room
socket.emit('join_project', 'PROJECT_ID');

// Listen for real-time task updates
socket.on('task_updated', (data) => {
  console.log('Task updated:', data);
});

// Send a message
socket.emit('send_message', {
  teamId: 'TEAM_ID',
  content: 'Hello team!'
});

// Listen for new messages
socket.on('new_message', (data) => {
  console.log('New message:', data);
});

// Typing indicators
socket.emit('typing_start', { teamId: 'TEAM_ID' });
socket.emit('typing_stop', { teamId: 'TEAM_ID' });
```

## Testing Flow

1. **Create Admin User**: Sign up with ADMIN role
2. **Login**: Get JWT token
3. **Create Team**: With the admin user as initial admin
4. **Create More Users**: Sign up additional users
5. **Add Users to Team**: Use the add members endpoint
6. **Create Project**: With team members
7. **Add Tasks**: Create tasks in different status columns
8. **Test Real-time**: Connect with Socket.IO and test live updates
9. **Send Messages**: Test team chat functionality
10. **Search Messages**: Test message search feature

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "validation error details"
  }
}
```

## Success Responses

All successful requests return:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```
