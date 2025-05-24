# Kunban Backend

A modular Node.js backend for a Team Collaboration Platform.

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- Socket.IO
- JWT Auth
- Joi Validation
- Firebase Authentication

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