import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { userModel } from "../models/index.js";
import { invalidCred, roleNotAuthorized } from "../utils/error.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { admin } from "../services/firebaseService.js";

// Middleware to generate JWT token
export const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret);
};

// Middleware to authenticate JWT token
const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return invalidCred(res)("Authorization header missing or invalid format");
  }

  const idToken = authHeader.split(" ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Check if the user exists in the database
    const user = await userModel.findById(
      { firebaseUid: decodedToken.uid },
      "-password"
    );
    if (!user) {
      return notFound(res)("User");
    }
    req.user = user; // includes uid, email, etc.
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return errorResponse(res, error, "Failed to authenticate user");
  }
};

// Middleware to authorize user based on role
export const authorizeRole = (...roles) => {
  console.log("Authorizing roles:", roles);
  return (req, res, next) => {
    firebaseAuth(req, res, () => {
      if (!req.user) {
        return invalidCred(res)("User not authenticated");
      }
    });
    if (!roles.includes(req.user.role)) {
      return roleNotAuthorized(res);
    }
    next();
  };
};
