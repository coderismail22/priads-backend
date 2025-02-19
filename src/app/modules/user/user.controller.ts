import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const createStudent = catchAsync(async (req, res) => {
  const result = await UserServices.createStudentIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Student is created successfully",
    data: result,
  });
});

// Resend OTP (with delay)
const resendOTP = catchAsync(async (req, res) => {
  const { email } = req.body;
  const message = await UserServices.resendOTP(email);
  res.status(200).json({ message });
});

// Verify OTP
const verifyOTP = catchAsync(async (req, res) => {
  const { email, verificationCode } = req.body;
  const message = await UserServices.verifyOTP(email, verificationCode);
  res.status(200).json({ message });
});

const createAdmin = catchAsync(async (req, res) => {
  
  const result = await UserServices.createAdminIntoDB(req.body);
  

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin is created successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req?.user;

  const result = await UserServices.getMeFromDB(user.userId, user.role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const result = await UserServices.changeStatusIntoDB(id, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status changed successfully",
    data: result,
  });
});

export const UserControllers = {
  createStudent,
  resendOTP,
  verifyOTP,
  createAdmin,
  getMe,
  changeStatus,
};
