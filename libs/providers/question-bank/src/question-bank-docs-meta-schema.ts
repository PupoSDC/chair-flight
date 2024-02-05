import { z } from "zod";
import type { QuestionBankDoc } from "@chair-flight/base/types";

export const QuestionBankDocSchema: z.ZodSchema<QuestionBankDoc> = z.object({
  id: z.string(),
  title: z.string(),
  fileName: z.string(),
  learningObjectiveId: z.string(),
  empty: z.boolean(),
  parentId: z.string().optional(),
  subjectId: z.string(),
  content: z.string(),
  children: z.string().array(),
});
