import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

    // Use "iat" (issued at later if needed)
    const { userId, role } = decoded;

    // check: does the user exist
    const user = await User.findById(userId);
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

    // TODO: check isJWTIsIssuedBeforeChangingPassword
    // check: isJWTIssuedAtBeforeChangingPassword
    // if (user?.passwordChangedAt) {
    //   const isJWTIssuedAtBeforeChangingPassword =
    //     await User.isJWTIssuedAtBeforeChangingPassword(
    //       iat as number,
    //       user.passwordChangedAt,
    //     );

    //   if (isJWTIssuedAtBeforeChangingPassword) {
    //     throw new AppError(
    //       httpStatus.UNAUTHORIZED,
    //       "You are not authorized to access!",
    //     );
    //   }
    // }

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
