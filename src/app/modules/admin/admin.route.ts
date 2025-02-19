import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AdminControllers } from "./admin.controller";
import { AdminValidations } from "./admin.validation";

const router = express.Router();

router.post(
  "/create-admin",
  validateRequest(AdminValidations.createAdminValidationSchema),
  AdminControllers.createAdmin,
);

router.get("/:adminId", AdminControllers.getAdmin);

router.get("/", AdminControllers.getAllAdmins);

router.patch(
  "/update-admin/:adminId",
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete("/:adminId", AdminControllers.deleteAdmin);

export const AdminRoutes = router;
