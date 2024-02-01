import { z } from "zod";
import type { IsEqual } from "@chair-flight/base/utils";
import { assertType } from "@chair-flight/base/utils";
import type { Subject } from "../types";

export const subjectSchema = z.object({
  id: z.string(),
  courses: z.array(z.string()).min(1),
  learningObjectives: z.array(z.string()),
  longName: z.string(),
  shortName: z.string(),
  numberOfExamQuestions: z.number(),
  numberOfExamMinutes: z.number(),
  numberOfQuestions: z.number(),
});

type ISubject = z.infer<typeof subjectSchema>;
assertType<IsEqual<ISubject, Subject>>();
