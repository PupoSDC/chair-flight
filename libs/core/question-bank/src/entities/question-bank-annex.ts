import { z } from "zod";
import {
  annexIdSchema,
  docIdSchema,
  learningObjectiveIdSchema,
  questionBankNameSchema,
  questionTemplateIdSchema,
  subjectIdSchema,
} from "./question-bank-ids";

export const annexSchema = z.object({
  id: annexIdSchema,
  href: z.string(),
  srcLocation: z.string(),
  source: z.string(),
  questionBank: questionBankNameSchema,
  format: z.enum(["jpg"]),
  description: z.string(),
  docs: z.array(docIdSchema),
  questions: z.array(questionTemplateIdSchema),
  subjects: z.array(subjectIdSchema).min(1),
  learningObjectives: z.array(learningObjectiveIdSchema).min(1),
});

export type Annex = z.infer<typeof annexSchema>;
