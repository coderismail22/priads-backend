import httpStatus from "http-status";
import { TAdmin } from "./admin.interface";
import { Admin } from "./admin.model";
import AppError from "../../errors/AppError";

const createAdminInDB = async (adminData: TAdmin) => {
  const result = await Admin.create(adminData);
  return result;
};

const getAdminFromDB = async (adminId: string) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  return admin;
};

const getAllAdminsFromDB = async () => {
  const result = await Admin.find().sort({ createdAt: -1 });
  return result;
};

const updateAdminInDB = async (adminId: string, adminData: Partial<TAdmin>) => {
  const admin = await Admin.findByIdAndUpdate(adminId, adminData, {
    new: true,
    runValidators: true,
  });
  if (!admin) throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  return admin;
};

const deleteAdminFromDB = async (adminId: string) => {
  const admin = await Admin.findById(adminId);
  if (!admin) throw new AppError(httpStatus.NOT_FOUND, "Admin not found");
  const result = await admin.deleteOne();
  return result;
};

export const AdminServices = {
  createAdminInDB,
  getAdminFromDB,
  getAllAdminsFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
};
