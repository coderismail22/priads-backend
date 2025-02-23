import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "./auth.utils";
import sendEmail from "../../utils/sendEmail";
import { Admin } from "../admin/admin.model";
import mongoose from "mongoose";
type ChangePasswordPayload = {
  newPassword: string;
  oldPassword: string;
};
// login
const loginUser = async (payload: TLoginUser) => {
  // 1. Check if the user exist
  const user = await User.findOne({ email: payload?.email }).select(
    "+password",
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // 2. Check if the user is deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "The user has been deleted.");
  }

  //3. Check if the user is blocked
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "The user has been blocked.");
  }

  // 4. Check if the password is correct
  const isPasswordValid = payload?.password === user?.password;
  if (!isPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, "Password is incorrect.");
  }

  // ✅ 6. If verified, generate tokens
  //   TODO: send access and refresh token properly

  // create token and send to the client
  const jwtPayload = { userId: user?.id, email: user?.email, role: user?.role };

  // generate access token
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );

  // generate refresh token
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );

  return {
    isVerified: true,
    accessToken,
    refreshToken,
  };
};

// access token renewal
const refreshToken = async (token: string) => {
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
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  // used "iat"
  const { role, userId } = decoded;

  // check: does the user exist
  const user = await User.findOne({ _id: userId });
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

  // TODO: check isJWTIssuedAtBeforeChangingPassword
  // check: isJWTIssuedAtBeforeChangingPassword
  // if (user?.passwordChangedAt) {
  //   const isJWTIssuedAtBeforeChangingPassword =
  //     await User.isJWTIssuedAtBeforeChangingPassword(
  //       iat as number,
  //       user.passwordChangedAt,
  //     );

  // TODO: check isJWTIssuedAtBeforeChangingPassword
  // if (isJWTIssuedAtBeforeChangingPassword) {
  //   throw new AppError(
  //     httpStatus.UNAUTHORIZED,
  //     "You are not authorized to access!",
  //   );
  // }

  const jwtPayload = {
    userId: userId,
    role: role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );
  return accessToken;
};

//change password
const changePassword = async (
  userData: JwtPayload,
  payload: ChangePasswordPayload,
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find user by ID
    const user = await User.findById(userData?.userId)
      .select("+password")
      .session(session);
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.NOT_FOUND, "The user has been deleted.");
    }

    // Check if user is blocked
    if (user.status === "blocked") {
      throw new AppError(httpStatus.FORBIDDEN, "The user has been blocked.");
    }

    // Verify old password
    if (payload.oldPassword !== user.password) {
      throw new AppError(httpStatus.FORBIDDEN, "Old password is incorrect.");
    }

    // Update Admin password if applicable
    await Admin.updateOne(
      { email: userData?.email },
      { password: payload.newPassword },
    ).session(session);

    // Update User password
    await User.updateOne(
      { _id: userData?.userId, role: userData?.role },
      {
        password: payload.newPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
      },
    ).session(session);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { message: "Password changed successfully." };
  } catch (error) {
    // Rollback transaction on error
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Password update failed.",
    );
  }
};

// forgot password
const forgotPassword = async (email: string) => {
  // check: does the user exist
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist.");
  }

  // check: is the user deleted
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "The user has been deleted.");
  }

  // check: userStatus
  if (user?.status === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "The user has been blocked.");
  }

  // Generate a secure token using JWT
  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "10m",
  );
  const resetPasswordUILink = `${config.reset_password_ui_link}?id=${user?._id}&token=${resetToken}`;
  sendEmail(user.email, resetPasswordUILink);
  return {
    message: "Password reset link sent successfully.",
  };
};

const resetPassword = async (
  id: string,
  token: string,
  newPassword: string,
) => {
  // check: does the user exist
  const user = await User.findOne({ _id: id });
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

  // Verify the token
  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string,
  ) as JwtPayload;

  // do user matches
  if (id !== decoded.userId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User doesn't have access to the specified service.",
    );
  }

  // TODO: Hash passwords if needed hashing before saving
  // const newHashedPassword = await bcrypt.hash(
  //   newPassword,
  //   Number(config.bcrypt_salt_rounds),
  // );

  // Finally Update Password Into DB
  const result = await User.findOneAndUpdate(
    {
      _id: decoded?.userId,
      role: decoded?.role,
    },
    {
      password: newPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return result;
};

const checkAuthentication = (token: string) => {
  if (!token) {
    throw new Error("Not authenticated");
  }

  const decoded = jwt.verify(token, config.jwt_access_secret as string);
  return decoded;
};
export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
  checkAuthentication,
};
