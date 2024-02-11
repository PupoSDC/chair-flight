import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";

export const searchParams = z.object({
  q: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
  questionBank: questionBankNameSchema,
  searchField: z.string().or(z.literal("all")),
  filters: z.record(z.string().or(z.literal("all"))),
});

export type SearchParams = z.infer<typeof searchParams>;
