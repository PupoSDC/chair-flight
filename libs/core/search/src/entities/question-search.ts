import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { searchParams } from "./search-params";
import type {
  QuestionBankName,
  SubjectId,
} from "@chair-flight/core/question-bank";

export type QuestionSearchResult = {
  id: string;
  questionBank: QuestionBankName;
  subjects: SubjectId[];
  text: string;
  href: string;
  learningObjectives: Array<{
    id: string;
    href: string;
  }>;
  relatedQuestions: Array<{
    id: string;
    href: string;
  }>;
  externalIds: string[];
};

export const questionSearchFilters = z.object({
  subject: z.string(),
  searchField: z.string(),
});

export type QuestionSearchFilters = z.infer<typeof questionSearchFilters>;

export const questionSearchParams = searchParams.and(
  z.object({
    questionBank: questionBankNameSchema,
    filters: questionSearchFilters,
  }),
);

export type QuestionSearchParams = z.infer<typeof questionSearchParams>;
