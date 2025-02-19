import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./../student/student.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserValidations } from "./user.validation";
import { AdminValidations } from "../admin/admin.validation";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

// create student
router.post(
  "/create-student",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin), //TODO: Add a auth role
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

//resend otp
router.post(
  "/resend-otp",
  validateRequest(UserValidations.resendOTPValidationSchema),
  UserControllers.resendOTP,
);

//verify otp
router.post(
  "/verify-otp",
  validateRequest(UserValidations.verifyOTPValidationSchema),
  UserControllers.verifyOTP,
);

router.post(
  "/create-admin",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin), //TODO: Add a auth role
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

router.post(
  "/change-status/:id",
  auth("admin"),
  validateRequest(UserValidations.changeUserStatusValidationSchema),
  UserControllers.changeStatus,
);

router.get(
  "/me",
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.student),
  UserControllers.getMe,
);

export const UserRoutes = router;
