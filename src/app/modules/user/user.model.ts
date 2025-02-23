import { Schema, model } from "mongoose";
// import config from "../../config";
import { IUser } from "./user.interface";
import { STATUS } from "./user.constant";
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0, // makes invisible while finding
    },
    passwordChangedAt: {
      type: Date,
    },

    role: {
      type: String,
      enum: ["superAdmin", "student", "faculty", "admin"],
    },
    status: {
      type: String,
      enum: STATUS,
      default: "in-progress",
    },
    // OTP
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model<IUser>("User", userSchema);
