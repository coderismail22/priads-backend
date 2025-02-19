import { z } from "zod";
import { STATUS } from "./user.constant";

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: "Password must be string",
    })
    .max(20, { message: "Password can not be more than 20 characters" }),
});

const changeUserStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...STATUS] as [string, ...string[]]),
  }),
});

const resendOTPValidationSchema = z.object({
  body: z.object({
    email: z.string(),
  }),
});

const verifyOTPValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }),
    verificationCode: z.string({
      required_error: "Verification code is required",
    }),
  }),
});

export const UserValidations = {
  userValidationSchema,
  changeUserStatusValidationSchema,
  resendOTPValidationSchema,
  verifyOTPValidationSchema,
};
