/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { Student } from "../student/student.model";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { Admin } from "../admin/admin.model";
import { TAdmin } from "../admin/admin.interface";
import { IStudent } from "../student/student.interface";
import { generateOTP, sendVerificationEmail } from "./user.util";

const createStudentIntoDB = async (payload: IStudent) => {
  const otp = generateOTP();
  const otpExpiry = new Date();
  otpExpiry.setMinutes(otpExpiry.getMinutes() + 5); // OTP valid for 5 mins

  // create a user object
  const userData: Partial<IUser> = {};
  userData.name = payload.name;
  userData.role = "student";
  userData.email = payload.email;
  userData.password = payload.password;
  userData.verificationCode = otp;
  userData.otpExpiresAt = otpExpiry;
  userData.lastOtpSentAt = new Date();
  userData.isVerified = false;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //TODO: Generate Dynamic ID
    //TODO: Upload image to Cloudinary using Multer

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // send verification email
    await sendVerificationEmail(payload.email, otp);

    // create a student (transaction-2)
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw err;
  }
};

// Resend OTP with 2-Minute Delay
const resendOTP = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const currentTime = new Date().getTime();
  const lastOtpSent = user.lastOtpSentAt.getTime();

  // Prevent resending before 2 minutes
  if (lastOtpSent && currentTime - lastOtpSent < 2 * 60 * 1000) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please wait 2 minutes before requesting a new OTP",
    );
  }

  const newOtp = generateOTP();
  user.verificationCode = newOtp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes expiry
  user.lastOtpSentAt = new Date(currentTime);

  await user.save();
  await sendVerificationEmail(user.email, newOtp);
  return "A new OTP has been sent to your email!";
};

// Verify OTP
const verifyOTP = async (email: string, verificationCode: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  // Check if OTP is expired
  if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Check if OTP matches
  if (user.verificationCode !== verificationCode) {
    throw new Error("Invalid OTP. Please try again.");
  }

  // If OTP is correct, mark user as verified
  user.isVerified = true;
  user.verificationCode = null;
  user.otpExpiresAt = null;
  await user.save();

  return "Account verified successfully!";
};

const createAdminIntoDB = async (payload: TAdmin) => {
  // create a user object
  const userData: Partial<IUser> = {};
  userData.name = payload.name;
  userData.role = "admin";
  userData.email = payload.email;
  userData.password = payload.password;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // TODO: Generate Dynamic ID
    // TODO: Upload image to Cloudinary using Multer

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // create an admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to create admin");
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      err.message || "Transaction failed",
    );
  }
};

const getMeFromDB = async (userId: string, role: string) => {
  // Check if token is provided
  if (!userId || !role) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found.");
  }

  let result;

  // Fetch data based on the user's role
  switch (role) {
    case "admin":
      result = await Admin.findOne({ id: userId });
      break;
    case "student":
      result = await Student.findOne({ id: userId }).populate("");
      break;
    default:
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Access denied. Role not recognized.",
      );
  }

  // Return the result or handle the case where no data is found
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, `${role} data not found.`);
  }

  return result;
};

const changeStatusIntoDB = async (id: string, status: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  resendOTP,
  verifyOTP,
  createAdminIntoDB,
  getMeFromDB,
  changeStatusIntoDB,
};
