import { z } from "zod";

export const subjectSchema = z.object({
  id: z.string(),
  learningObjective: z.string(),
  nestedLearningObjectives: z.string().array(),
  courses: z.array(z.string()).min(1),
  longName: z.string(),
  shortName: z.string(),
  numberOfExamQuestions: z.number(),
  numberOfExamMinutes: z.number(),
  numberOfQuestions: z.number(),
});

export type Subject = z.infer<typeof subjectSchema>;
