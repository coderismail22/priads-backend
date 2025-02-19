import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "email is required" }),
    password: z.string({ required_error: "password is required" }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "old password is required" }),
    newPassword: z.string({ required_error: "new password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "Access token is required" }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "User email is required" }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: "Password must be at least 6 characters.",
    }),
  }),
});

export const AuthValidations = {
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
};
