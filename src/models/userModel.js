import mongoose from "mongoose";
import { roleEnums } from "../config/index.js";

const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    firebaseUid: { 
        type: String, 
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
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    hooks: {
      // Pre-save hook to set emailVerifiedAt when emailVerified is true
      pre: function (next) {
        if (this.isModified("emailVerified") && this.emailVerified === true) {
          this.emailVerifiedAt = new Date();
        }
        next();
      },
    },
  }
);

// Add pre-save middleware for hashing password and lowercasing email

const userModel = mongoose.model("User", userSchema);

export { userModel };
