/* eslint-disable @typescript-eslint/no-explicit-any */
import { Student } from "./student.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// Get a student
const getStudent = async (studentEmail: string) => {
  const student = await Student.findOne({ email: studentEmail }).select({
    _id: 1,
    name: 1,
    email: 1,
  });
  return student;
};
// Get all students
const getAllStudents = async () => {
  const students = await Student.find();
  return students;
};

// Get a single course's details for a specific student, including progress tracking

// Create a student
const createStudentInDB = async (data: {
  name: string;
  email: string;
  courses?: { courseId: string }[];
}) => {
  // Create the student
  const student = await Student.create({
    name: data.name,
    email: data.email,
    courses: [],
  });
  return student;
};

const getLastCompletedLesson = async (studentId: string, courseId: string) => {
  const student = await Student.findById(studentId).populate({
    path: "courses",
    match: { courseId }, // Match the specific course in the courses array by courseId
    populate: {
      path: "subjects",
      populate: {
        path: "topics",
        populate: {
          path: "lessons",
          model: "Lesson", // Populate lessons using the Lesson model
        },
        model: "Topic", // Populate topics using the Topic model
      },
    },
  });

  if (!student) throw new Error("Student not found");

  // Find the specific course progress in the student's courses
  const courseProgress = student.courses.find(
    (course) => course.courseId && course.courseId.toString() === courseId,
  );

  if (!courseProgress) throw new Error("Course progress not found");

  // Initialize last completed lesson variable
  let lastCompletedLessonId = null;

  // Iterate over subjects, topics, and lessons with null checks
  for (const subject of courseProgress.subjects || []) {
    for (const topic of subject.topics || []) {
      for (const lesson of topic.lessons || []) {
        if (!lesson.isCompleted) {
          // Return the last completed lesson if a lesson is not completed
          return lastCompletedLessonId;
        }
        lastCompletedLessonId = lesson.lessonId;
      }
    }
  }

  if (lastCompletedLessonId === null) {
    throw new AppError(httpStatus.NOT_FOUND, "Not found any completed lesson.");
  }
  return lastCompletedLessonId;
};

const updateLessonProgress = async ({
  studentId,
  courseId,
  lessonId,
}: {
  studentId: string;
  courseId: string;
  lessonId: string;
}) => {
  // Find the student and populate the necessary course structure
  const student = await Student.findById(studentId).populate({
    path: "courses",
    match: { courseId }, // Match the specific course in the courses array by courseId
    populate: {
      path: "subjects",
      populate: {
        path: "topics",
        populate: {
          path: "lessons",
          model: "Lesson", // Ensure `Lesson` model is used for `lessons`
        },
        model: "Topic", // Ensure `Topic` model is used for `topics`
      },
      model: "Subject", // Ensure `Subject` model is used for `subjects`
    },
  });

  if (!student) throw new AppError(httpStatus.NOT_FOUND, "Student not found");

  // Check if the specific course progress exists for this courseId
  const courseProgress = student.courses.find(
    (course) => course.courseId.toString() === courseId,
  );

  if (!courseProgress) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Course not found for this student",
    );
  }

  // Traverse subjects in the course to locate the specified lesson
  for (const subject of courseProgress.subjects) {
    for (const topic of subject.topics) {
      for (let i = 0; i < topic.lessons.length; i++) {
        const lessonProgress = topic.lessons[i];

        // Check if the lesson matches the one we're updating
        if (lessonProgress.lessonId.toString() === lessonId) {
          // Mark the lesson as completed
          lessonProgress.isCompleted = true;
          lessonProgress.completedAt = new Date();

          // Unlock the next lesson, if it exists (skip this for the last lesson)
          if (i + 1 < topic.lessons.length) {
            topic.lessons[i + 1].isAccessible = true; // Unlock the next lesson
          }

          // Save the updated student document
          await student.save();
          return lessonProgress; // Return the updated lesson progress
        }
      }
    }
  }

  // If the specified lesson was not found in progress data, throw an error
  throw new AppError(
    httpStatus.NOT_FOUND,
    "Lesson not found in course progress",
  );
};

export const StudentServices = {
  createStudentInDB,
  getStudent,
  getAllStudents,
  getLastCompletedLesson,
  updateLessonProgress,
};
