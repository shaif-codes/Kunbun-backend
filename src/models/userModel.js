import mongoose from "mongoose";
import { roleEnums } from "../config/index.js";

const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    firebaseUid: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(roleEnums),
      default: roleEnums.MEMBER,
      required: true,
    },
    teamId: {
      type: Types.ObjectId,
      ref: "Team",
    },
    darkTheme: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Add pre-save middleware for hashing password and lowercasing email

const userModel = mongoose.model("User", userSchema);

export { userModel };
