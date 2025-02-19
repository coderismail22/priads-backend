import { z } from "zod";

const createAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Admin name is required"),
    password: z.string().min(1, "Password is required"),
    email: z.string().email("Email must be valid"),
    phone: z.string().optional(),
    profileImg: z.string().optional(), //TODO: add checking if user gives profile url
    // role: z.enum(["superAdmin", "admin"]),
  }),
});

const updateAdminValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Admin name is required").optional(),
    password: z.string().min(1, "Password is required").optional(),
    email: z.string().email("Email must be valid").optional(),
    phone: z.string().optional(),
    profileImg: z.string().optional(),
    role: z.enum(["superAdmin", "admin"]).optional(),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
