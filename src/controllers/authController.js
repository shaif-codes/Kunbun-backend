// auth with firebase
import { userModel } from "../models/index.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { notFound, invalidCred } from "../utils/error.js";
import { firebaseService } from "../services/firebaseService.js";
import jwt from "jsonwebtoken";

export const authController = {
  // firebase signup
  firebaseSignup: async (req, res) => {
    const { email, password, name } = req.body;
    try {
      // Create user with Firebase Client SDK
      const firebaseUser = await firebaseService.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("Firebase user created:", firebaseUser.uid);

      // Save user to your database
      const user = await userModel.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name
      });

      return successResponse(res, user, "User created successfully");
    } catch (error) {
      console.error("Error creating Firebase user:", error);
      return res.status(500).json({
        message: "Failed to create user",
        error: error.message,
      });
    }
  },

  // firebase login
  firebaseLogin: async (req, res) => {
    const { email, password } = req.body;
    console.log("Login request received:", { email });

    try {
      // Sign in with Firebase Client SDK
      const firebaseUser = await firebaseService.signInWithEmailAndPassword(
        email,
        password
      );
      console.log("Firebase user signed in:", firebaseUser.uid);

      // Find user in your database
      const user = await userModel.findOne({ firebaseUid: firebaseUser.uid });
      if (!user) {
        return notFound(res)("User");
      }

      // Generate JWT token and attach it to the user object
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      user.token = token; // Attach token to user object

      return successResponse(res, { token }, "User logged in successfully");
    } catch (error) {
      console.error("Error logging in Firebase user:", error);
      return invalidCred(res);
    }
  },
  firebaseResetPassword: async (req, res) => {
    const { email } = req.query;
    
    // Validate email parameter
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    try {
      // Check if user exists in your database (optional)
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User with this email does not exist",
        });
      }

      // Send password reset email using Firebase Client SDK
      await firebaseService.sendPasswordResetEmail(email);
      return successResponse(res, null, "Password reset email sent successfully");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      return errorResponse(res, error, "Failed to send password reset email");
    }
  }
};
