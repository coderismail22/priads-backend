import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { AdminValidations } from "../admin/admin.validation";

const router = express.Router();

router.post(
  "/create-admin",
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin), //TODO: Add a auth role
  validateRequest(AdminValidations.createAdminValidationSchema),
  UserControllers.createAdmin,
);

export const UserRoutes = router;
