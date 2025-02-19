import httpStatus from "http-status";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";
import AppError from "../../errors/AppError";

const createCategoryInDB = async (categoryData: TCategory) => {
  const result = await Category.create(categoryData);
  return result;
};

const getCategoryFromDB = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  return category;
};

const getAllCategoriesFromDB = async () => {
  const result = await Category.find();
  return result;
};

const updateCategoryInDB = async (
  categoryId: string,
  categoryData: Partial<TCategory>,
) => {
  const category = await Category.findByIdAndUpdate(categoryId, categoryData, {
    new: true,
  });
  if (!category) throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  return category;
};

const deleteCategoryFromDB = async (categoryId: string) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  const result = await category.deleteOne();
  return result;
};

export const CategoryServices = {
  createCategoryInDB,
  getCategoryFromDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};
