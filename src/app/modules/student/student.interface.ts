import { Types } from "mongoose";

export interface ILessonProgress {
  lessonId: Types.ObjectId;
  isAccessible: boolean;
  isCompleted: boolean;
  completedAt?: Date | null;
}

export interface ITopicProgress {
  topicId: Types.ObjectId;
  lessons: ILessonProgress[];
}

export interface ISubjectProgress {
  subjectId: Types.ObjectId;
  topics: ITopicProgress[];
}

export interface ICourseProgress {
  courseId: Types.ObjectId;
  subjects: ISubjectProgress[];
}

export interface IStudent {
  name: string;
  email: string;
  password: string;
  courses: ICourseProgress[];
}
