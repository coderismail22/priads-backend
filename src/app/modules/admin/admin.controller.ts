import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { AdminServices } from "./admin.service";
import sendResponse from "../../utils/sendResponse";

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.createAdminInDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const getAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getAdminFromDB(req.params.adminId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const getAllAdmins = catchAsync(async (_req: Request, res: Response) => {
  const result = await AdminServices.getAllAdminsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All admins retrieved successfully",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.updateAdminInDB(
    req.params.adminId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.deleteAdminFromDB(req.params.adminId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminControllers = {
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
