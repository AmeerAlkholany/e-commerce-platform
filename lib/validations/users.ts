import { z } from "zod";

export const userStatusSchema = z.enum(["active", "suspended", "banned"]);
export const userRoleSchema = z.enum(["admin", "customer"]);
export const verificationStatusSchema = z.enum(["unverified", "verified"]);

export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: userRoleSchema.optional().default("customer"),
  status: userStatusSchema.optional().default("active"),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url("Invalid avatar URL").optional().nullable(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
  verification_status: verificationStatusSchema.optional(),
  phone: z.string().optional().nullable(),
  avatar_url: z.string().url("Invalid avatar URL").optional().nullable(),
});

export const bulkActionSchema = z.object({
  userIds: z.array(z.number()),
  action: z.enum(["activate", "suspend", "delete", "set-role", "verify"]),
  role: userRoleSchema.optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.string().email("Please enter a valid email address").trim().toLowerCase(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export type LoginInputs = z.infer<typeof loginSchema>;
export type SignupInputs = z.infer<typeof signupSchema>;
export type CreateUserInputs = z.infer<typeof createUserSchema>;
export type UpdateUserInputs = z.infer<typeof updateUserSchema>;
export type BulkActionInputs = z.infer<typeof bulkActionSchema>;
