import { z } from "zod";
import { assertType } from "@cf/base/utils";
import { questionBankNameSchema } from "./question-bank-name";
import type {
  CourseId,
  DocId,
  LearningObjectiveId,
  QuestionTemplateId,
  SubjectId,
} from "./ids";
import type { QuestionBankName } from "./question-bank-name";
import type { IsEqual } from "@cf/base/utils";

export type LearningObjective = {
  id: LearningObjectiveId;
  questionBank: QuestionBankName;
  parentId?: LearningObjectiveId;
  subject: SubjectId;
  doc: DocId;
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
  parentId: z.string().optional(),
  doc: z.string(),
  subject: z.string(),
  courses: z.array(z.string()),
  learningObjectives: z.array(z.string()),
  text: z.string(),
  source: z.string(),
  questions: z.array(z.string()),
  nestedQuestions: z.array(z.string()),
});

type ILearningObjective = z.infer<typeof LearningObjectiveSchema>;
assertType<IsEqual<ILearningObjective, LearningObjective>>();
