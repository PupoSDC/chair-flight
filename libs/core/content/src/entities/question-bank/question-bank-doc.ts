import { z } from "zod";
import {
  docIdSchema,
  learningObjectiveIdSchema,
  questionBankNameSchema,
  subjectIdSchema,
} from "./question-bank-ids";

export const docSchema = z.object({
  id: docIdSchema,
  rootDocId: docIdSchema,
  rootDocToc: z
    .array(
      z.object({
        id: docIdSchema,
        title: z.string(),
        nestedDocs: z.array(
          z.object({
            id: docIdSchema,
            title: z.string(),
          }),
        ),
      }),
    )
    .optional(),
  parentId: docIdSchema.optional(),
  subject: subjectIdSchema.optional(),
  questionBank: questionBankNameSchema,
  learningObjectives: learningObjectiveIdSchema.array(),
  title: z.string(),
  description: z.string().optional(),
  fileName: z.string(),
  content: z.string(),
  empty: z.boolean(),
});

export type Doc = z.infer<typeof docSchema>;
