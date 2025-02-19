import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
// import { User } from "../user/user.model";
import { AuthServices } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import config from "../../config";
import AppError from "../../errors/AppError";

// login controller
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  // If the user is not verified, send a response without tokens
  if (!result.isVerified) {
    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result?.message,
      data: {
        isVerified: false, // Explicitly indicate user is not verified
      },
    });
  }

  // If the user is verified, proceed with token generation and response
  const { accessToken, refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    // sameSite: "Strict", // Prevent CSRF
    path: "/", // Cookie available site-wide
    maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 7 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login successful",
    data: {
      isVerified: true,
      accessToken,
      refreshToken,
    },
  });
});

// change password controller
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const accessToken = await AuthServices.refreshToken(refreshToken);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "New access token has been retrieved successfully.",
    data: accessToken,
  });
});

//TODO: make a logout endpoint that invalidates the refresh token*

// change password controller
const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(req.user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password has been updated successfully.",
    data: result,
  });
});

// forgot password (UI link generation)
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await AuthServices.forgotPassword(email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link has been generated successfully.",
    data: result,
  });
});

// reset password
const resetPassword = catchAsync(async (req, res) => {
  const { token, id } = req.query;
  const { newPassword } = req.body;

  if (!token || !id) {
    throw new AppError(httpStatus.BAD_REQUEST, "Token or ID is missing.");
  }

  const result = await AuthServices.resetPassword(
    id as string,
    token as string,
    newPassword,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password has been reset successfully.",
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgotPassword,
  resetPassword,
};
