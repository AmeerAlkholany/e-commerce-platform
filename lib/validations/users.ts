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

export type CreateUserInputs = z.infer<typeof createUserSchema>;
export type UpdateUserInputs = z.infer<typeof updateUserSchema>;
export type BulkActionInputs = z.infer<typeof bulkActionSchema>;
