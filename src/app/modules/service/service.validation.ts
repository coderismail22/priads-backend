import { z } from "zod";

const createServiceValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required"),
    author: z.string().trim().min(1, "Author is required"),
    image: z.string().url("Image must be a valid URL"),
    body: z.string().min(1, "Body is required"),
    category: z.array(z.string()).optional(),
    comments: z.array(z.string()).optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updateServiceValidationSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required").optional(),
    author: z.string().trim().min(1, "Author is required").optional(),
    image: z.string().url("Image must be a valid URL").optional(),
    body: z.string().min(1, "Body is required").optional(),
    category: z.array(z.string()).optional(),
    comments: z.array(z.string()).optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const ServiceValidations = {
  createServiceValidationSchema,
  updateServiceValidationSchema,
};
