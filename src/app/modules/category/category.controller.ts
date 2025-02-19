import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { CategoryServices } from "./category.service";
import sendResponse from "../../utils/sendResponse";

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.createCategoryInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

const getCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.getCategoryFromDB(
    req.params.categoryId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

const getAllCategories = catchAsync(async (_req: Request, res: Response) => {
  const result = await CategoryServices.getAllCategoriesFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All categories retrieved successfully",
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.updateCategoryInDB(
    req.params.categoryId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category updated successfully",
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await CategoryServices.deleteCategoryFromDB(
    req.params.categoryId,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Category deleted successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
