import { z } from "zod";
import { assertType } from "@cf/base/utils";
import type { CourseId, LearningObjectiveId, SubjectId } from "./ids";
import type { IsEqual } from "@cf/base/utils";

export type Subject = {
  id: SubjectId;
  learningObjective: LearningObjectiveId;
  /** Includes all Learning objectives from this subject */
  nestedLearningObjectives: LearningObjectiveId[];
  courses: CourseId[];
  longName: string;
  shortName: string;
  numberOfExamQuestions: number;
  numberOfExamMinutes: number;
  numberOfQuestions: number;
};

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

type ISubject = z.infer<typeof subjectSchema>;
assertType<IsEqual<ISubject, Subject>>();
