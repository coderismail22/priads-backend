import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./../student/student.validation";
import { UserControllers } from "./user.controller";
import { AdminValidations } from "../admin/admin.validation";

const router = express.Router();

// create student
router.post(
  "/create-student",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin), //TODO: Add a auth role
  validateRequest(StudentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  "/create-admin",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin), //TODO: Add a auth role
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);


export const UserRoutes = router;
