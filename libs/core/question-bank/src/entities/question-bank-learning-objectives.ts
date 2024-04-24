import { z } from "zod";
import {
  courseIdSchema,
  docIdSchema,
  learningObjectiveIdSchema,
  questionBankNameSchema,
  questionTemplateIdSchema,
  subjectIdSchema,
} from "./question-bank-ids";

export const LearningObjectiveSchema = z.object({
  id: learningObjectiveIdSchema,
  questionBank: questionBankNameSchema,
  parentId: learningObjectiveIdSchema.nullable(),
  doc: docIdSchema,
  subject: subjectIdSchema,
  courses: courseIdSchema.array(),
  learningObjectives: learningObjectiveIdSchema.array(),
  /** Includes Only questions that directly reference this LO */
  questions: questionTemplateIdSchema.array(),
  /** Includes Questions from this LO and from nested LOs */
  nestedQuestions: questionTemplateIdSchema.array(),
  text: z.string(),
  source: z.string(),
});

export type LearningObjective = z.infer<typeof LearningObjectiveSchema>;
