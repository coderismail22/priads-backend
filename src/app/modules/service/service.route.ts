import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { ServiceControllers } from "./service.controller";
import { ServiceValidations } from "./service.validation";
const router = express.Router();

// Create a service
router.post(
  "/",
  validateRequest(ServiceValidations.createServiceValidationSchema),
  ServiceControllers.createService
);
router.get("/", ServiceControllers.getAllServices);
router.get("/:id", ServiceControllers.getService);
router.patch(
  "/:id",
  validateRequest(ServiceValidations.updateServiceValidationSchema),
  ServiceControllers.updateService
);
router.delete("/:id", ServiceControllers.deleteService);

export const ServiceRoutes = router;