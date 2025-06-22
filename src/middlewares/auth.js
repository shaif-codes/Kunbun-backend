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

// Middleware to authenticate user with jwt
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return invalidCred(res);
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user) {
      return invalidCred(res);
    }

    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return invalidCred(res);
    }
    console.error("Error fetching user:", error);
    return errorResponse(res, error, "Internal server error");
  }
};

// Middleware to authorize user based on role
export const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return invalidCred(res);
    }
    
    console.log("User role:", req.user.role);
    if (!roles.includes(req.user.role)) {
      return roleNotAuthorized(res);
    }

    next();
  };
};
