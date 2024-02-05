import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { searchParams } from "./search-params";
import type {
  CourseId,
  LearningObjectiveId,
  QuestionBankName,
  SubjectId,
} from "@chair-flight/core/question-bank";

export type LearningObjectiveSearchResult = {
  id: LearningObjectiveId;
  href: string;
  parentId: LearningObjectiveId | CourseId;
  courses: Array<{ id: CourseId; text: string }>;
  text: string;
  source: string;
  subject: SubjectId;
  questionBank: QuestionBankName;
  numberOfQuestions: number;
};

export const learningObjectiveSearchFilters = z.object({
  subject: z.string().default("all"),
  course: z.string().default("all"),
  searchField: z.string().default("all"),
});

export type LearningObjectiveSearchFilters = z.infer<
  typeof learningObjectiveSearchFilters
>;

export const learningObjectivesSearchParams = searchParams.and(
  z.object({
    questionBank: questionBankNameSchema,
    filters: learningObjectiveSearchFilters,
  }),
);

export type LearningObjectiveSearchParams = z.infer<
  typeof learningObjectivesSearchParams
>;
