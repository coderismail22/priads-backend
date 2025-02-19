import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryControllers } from "./category.controller";
import { CategoryValidations } from "./category.validation";

const router = express.Router();

router.post(
  "/create-category",
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin), //TODO: Add a auth role
  validateRequest(CategoryValidations.createCategoryValidationSchema),
  CategoryControllers.createCategory,
);

router.get(
  "/:categoryId",
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.student),
  CategoryControllers.getCategory,
);
router.get(
  "/",
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.student),
  CategoryControllers.getAllCategories,
);

router.patch(
  "/update-category/:categoryId",
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin), //TODO: Add a auth role
  validateRequest(CategoryValidations.updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.delete(
  "/:categoryId",
  // auth(USER_ROLE.admin, USER_ROLE.superAdmin), //TODO: Add a auth role
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
