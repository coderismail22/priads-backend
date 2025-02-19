import express from "express";
import { StudentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StudentValidations } from "./student.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(StudentValidations.createStudentValidationSchema),
  StudentControllers.createStudent,
);
// single student
router.get(
  "/:email",
  auth(USER_ROLE.student, USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentControllers.getStudent,
);

// all students
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  StudentControllers.getAllStudents,
);

// TODO: add student auth role
router.post(
  "/get-last-completed-lesson",
  StudentControllers.getLastCompletedLesson,
);

// TODO: add student auth role
router.patch(
  "/update-student-lesson-progress",
  validateRequest(StudentValidations.updateLessonProgressValidationSchema),
  StudentControllers.updateLessonProgress,
);

export const StudentRoutes = router;
