import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { searchParams } from "./search-params";
import type {
  AnnexId,
  LearningObjectiveId,
  QuestionBankName,
  QuestionId,
  SubjectId,
} from "@chair-flight/core/question-bank";

export type AnnexSearchResult = {
  id: AnnexId;
  href: string;
  questionBank: QuestionBankName;
  description: string;
  subjects: SubjectId[];
  questions: Array<{ id: QuestionId; href: string }>;
  learningObjectives: Array<{ id: LearningObjectiveId; href: string }>;
};

export const annexSearchFilters = z.object({
  subject: z.string().default("all"),
  searchField: z.string().default("all"),
});

export type AnnexSearchFilters = z.infer<typeof annexSearchFilters>;

export const annexSearchParams = searchParams.and(
  z.object({
    questionBank: questionBankNameSchema,
    filters: annexSearchFilters,
  }),
);

export type AnnexSearchParams = z.infer<typeof annexSearchParams>;
