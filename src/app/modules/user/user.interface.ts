/* eslint-disable no-unused-vars */
import { USER_ROLE } from "./user.constant";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: "superAdmin" | "admin" | "student" | "faculty";
  status: "in-progress" | "blocked";
  isDeleted: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
