import {
  questionTemplateSchema,
  learningObjectiveSchema,
  annexSchema,
  subjectSchema,
  docSchema,
  courseSchema,
} from "@cf/core/question-bank";
import type { z } from "zod";

export const questionTemplateJsonSchema = questionTemplateSchema.pick({
  id: true,
  relatedQuestions: true,
  externalIds: true,
  annexes: true,
  learningObjectives: true,
  explanation: true,
  variant: true,
});

export const learningObjectiveJsonSchema = learningObjectiveSchema.pick({
  id: true,
  parentId: true,
  subject: true,
  courses: true,
  source: true,
  text: true,
});

export const subjectJsonSchema = subjectSchema.pick({
  id: true,
  learningObjective: true,
  numberOfExamMinutes: true,
  numberOfExamQuestions: true,
  shortName: true,
  longName: true,
});

export const annexJsonSchema = annexSchema.pick({
  id: true,
  description: true,
  format: true,
  source: true,
});

export const docJsonSchema = docSchema.pick({
  id: true,
  parentId: true,
  title: true,
  content: true,
  fileName: true,
  description: true,
});

export const courseJsonSchema = courseSchema;

export type QuestionTemplateJson = z.infer<typeof questionTemplateJsonSchema>;
export type LearningObjectiveJson = z.infer<typeof learningObjectiveJsonSchema>;
export type SubjectJson = z.infer<typeof subjectJsonSchema>;
export type AnnexJson = z.infer<typeof annexJsonSchema>;
export type DocJson = z.infer<typeof docJsonSchema>;
export type CourseJson = z.infer<typeof courseJsonSchema>;
