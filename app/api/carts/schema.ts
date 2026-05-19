// app/actions/schemas.ts
import { z } from "zod";

export const CreateCartSchema = z.object({
  id: z.number().optional(),
  user_id: z.number(),
  created_at: z.string().optional(),
});

// Derive the TypeScript type directly from the Zod schema
export type CreateCartInput = z.infer<typeof CreateCartSchema>;
