import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { StudentServices } from "./student.service";

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const student = await StudentServices.createStudentInDB(req.body);

  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    data: student,
    message: "Student created successfully",
  });
});

const getStudent = catchAsync(async (req: Request, res: Response) => {
  const email = req.params.email;
  const student = await StudentServices.getStudent(email);
  sendResponse(res, {
    success: true,
    message: "Student retrieved successfully",
    statusCode: httpStatus.OK,
    data: student,
  });
});

const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  const students = await StudentServices.getAllStudents();
  sendResponse(res, {
    success: true,
    message: "Students retrieved successfully",
    statusCode: httpStatus.OK,
    data: students,
  });
});

const getLastCompletedLesson = catchAsync(
  async (req: Request, res: Response) => {
    const { studentId, courseId } = req.body;
    const result = await StudentServices.getLastCompletedLesson(
      studentId,
      courseId,
    );

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: "Last completed lesson retrieved successfully",
    });
  },
);

const updateLessonProgress = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentServices.updateLessonProgress(req.body);
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Lesson progress updated successfully",
    data: result,
  });
});

export const StudentControllers = {
  createStudent,
  getStudent,
  getAllStudents,
  getLastCompletedLesson,
  updateLessonProgress,
};
