/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { Admin } from "../admin/admin.model";
import { TAdmin } from "../admin/admin.interface";

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

export const UserServices = {
  createAdminIntoDB,
};
