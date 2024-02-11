import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import type { CourseId, LearningObjectiveId, QuestionTemplateId } from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { IsEqual } from "@chair-flight/base/utils";

export type LearningObjective = {
  id: LearningObjectiveId;
  questionBank: QuestionBankName;
  parentId: LearningObjectiveId | CourseId;
  courses: CourseId[];
  learningObjectives: LearningObjectiveId[];

  text: string;
  source: string;
  questions: QuestionTemplateId[];

  /** Includes Questions from this LO and from nested LOs */
  nestedQuestions: QuestionTemplateId[];
};

export const LearningObjectiveSchema = z.object({
  id: z.string(),
  questionBank: questionBankNameSchema,
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
