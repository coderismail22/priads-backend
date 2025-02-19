// Models
import { Schema, model } from "mongoose";
import {
  ICourseProgress,
  ILessonProgress,
  IStudent,
  ISubjectProgress,
  ITopicProgress,
} from "./student.interface";

// Lesson Progress Schema
const lessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  isAccessible: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

// Topic Progress Schema
const topicProgressSchema = new Schema<ITopicProgress>({
  topicId: {
    type: Schema.Types.ObjectId,
    ref: "Topic",
    required: true,
  },
  lessons: { type: [lessonProgressSchema] }, // Track progress for lessons in this topic
});

// Subject Progress Schema
const subjectProgressSchema = new Schema<ISubjectProgress>({
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  topics: { type: [topicProgressSchema] }, // Track progress for topics in this subject
});

// Course Progress Schema
const courseProgressSchema = new Schema<ICourseProgress>({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  subjects: { type: [subjectProgressSchema], default: [] }, // Track progress for subjects in this course
});

// Student Schema
const studentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  courses: { type: [courseProgressSchema], default: [] }, // Track progress for each course
});

export const Student = model<IStudent>("Student", studentSchema);
