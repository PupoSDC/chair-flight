import { z } from "zod";

export const searchParams = z.object({
  q: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});
