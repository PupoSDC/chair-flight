import { z } from "zod";
import {
  docIdSchema,
  learningObjectiveIdSchema,
  questionBankNameSchema,
  subjectIdSchema,
} from "./question-bank-ids";

export const docSchema = z.object({
  id: docIdSchema,
  parentId: docIdSchema.optional(),
  subject: subjectIdSchema.optional(),
  questionBank: questionBankNameSchema,
  learningObjectives: learningObjectiveIdSchema.array(),
  docs: docIdSchema.array(),
  nestedDocs: docIdSchema.array(),
  title: z.string(),
  description: z.string().optional(),
  fileName: z.string(),
  content: z.string(),
  empty: z.boolean(),
});

export type Doc = z.infer<typeof docSchema>;
