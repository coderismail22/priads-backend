import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidations } from "./auth.validation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

// Login
router.post(
  "/login",
  validateRequest(AuthValidations.loginValidationSchema),
  AuthControllers.loginUser,
);

// Refresh Token
router.post(
  "/refresh-token",
  validateRequest(AuthValidations.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

// Change Password
router.post(
  "/change-password",
  auth(USER_ROLE.admin), //TODO: Add auth middleware
  validateRequest(AuthValidations.changePasswordValidationSchema),
  AuthControllers.changePassword,
);

// Forgot Password
router.post(
  "/forgot-password",
  validateRequest(AuthValidations.forgotPasswordValidationSchema),
  AuthControllers.forgotPassword,
);

// Forgot Password
router.post(
  "/reset-password",
  validateRequest(AuthValidations.resetPasswordValidationSchema),
  AuthControllers.resetPassword,
);

router.post("/check-auth", AuthControllers.checkAuth);

export const AuthRoutes = router;
