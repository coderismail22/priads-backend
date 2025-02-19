import { z } from "zod";

const createStudentValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z.string().email("Invalid email address"),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const initializeCourseProgressValidationSchema = z.object({
  body: z.object({
    studentId: z.string({ required_error: "Student ID is required" }),
    courseId: z.string({ required_error: "Course ID is required" }),
  }),
});

const updateLessonProgressValidationSchema = z.object({
  body: z.object({
    studentId: z.string({ required_error: "Student ID is required" }),
    courseId: z.string({ required_error: "Course ID is required" }),
    lessonId: z.string({ required_error: "Lesson ID is required" }),
  }),
});

export const StudentValidations = {
  createStudentValidationSchema,
  initializeCourseProgressValidationSchema,
  updateLessonProgressValidationSchema,
};
