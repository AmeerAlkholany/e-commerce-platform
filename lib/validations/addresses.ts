import { z } from "zod";

export const createAddressSchema = z.object({
  userId: z.number({ required_error: "User ID is required" }),
  street: z.string().min(1, "Street is required").max(255).optional().nullable(),
  city: z.string().min(1, "City is required").max(100).optional().nullable(),
  country: z.string().min(1, "Country is required").max(100).optional().nullable(),
});

export const updateAddressSchema = z.object({
  street: z.string().min(1, "Street is required").max(255).optional().nullable(),
  city: z.string().min(1, "City is required").max(100).optional().nullable(),
  country: z.string().min(1, "Country is required").max(100).optional().nullable(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
