import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { ObjectId } from "bson";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // console.log("Received Authorization Header:", req.headers.authorization);

    const token = req.headers.authorization;
    // console.log("hit token", token);
    // if token not provided
    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You are not authorized to access!",
      );
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
    // console.log("🚀 ~ returncatchAsync ~ decoded:", decoded);

    const { userId, role } = decoded;
    // console.log("🚀 ~ returncatchAsync ~ userId:", userId);
    // console.log("🚀 ~ returncatchAsync ~ role:", role);

    const transformedUserId = new ObjectId(userId);

    // check: does the user exist
    const user = await User.findById(transformedUserId);
    // console.log("🚀 ~ returncatchAsync ~ user:", user)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
    }

    // check: is the user deleted
    const isUserDeleted = user?.isDeleted;
    if (isUserDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "The user has been deleted.");
    }

    // check: userStatus
    const userStatus = user?.status;
    if (userStatus === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "The user has been blocked.");
    }

    // check if the user role is allowed
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You do not have permission to access this resource!",
      );
    }

    // Attach decoded token data to req.user
    req.user = decoded;
    next();
  });
};

export default auth;
