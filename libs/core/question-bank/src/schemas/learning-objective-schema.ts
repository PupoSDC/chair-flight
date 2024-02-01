import { z } from "zod";
import { assertType, IsEqual } from "@chair-flight/base/utils";
import { LearningObjective } from "../types";

export const LearningObjectiveSchema = z.object({
  id: z.string(),
  parentId: z.string(),
  courses: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  text: z.string(),
  source: z.string(),
  questions: z.array(z.string()),
  nestedQuestions: z.array(z.string()),
});

type ILearningObjective = z.infer<typeof LearningObjectiveSchema>;
assertType<IsEqual<ILearningObjective, LearningObjective>>();
