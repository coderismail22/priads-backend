/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
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
  // OTP
  verificationCode: string | null;
  otpExpiresAt: Date | null;
  lastOtpSentAt: Date; // To handle resend delay
  isVerified: boolean;

  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  //Static method type declaration : function-name(parameter):return

  // doesUserExistByCustomId
  doesUserExistByCustomId(id: string): Promise<IUser>;

  // doPasswordsMatch
  doPasswordsMatch(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  // isUserDeleted
  isUserDeleted(id: string): Promise<boolean>;

  // isJWTIssuedAtBeforeChangingPassword
  isJWTIssuedAtBeforeChangingPassword(
    jwtIssuedAtTimeStamp: number,
    passwordChangedAtTimeStamp: Date,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
