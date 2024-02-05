import { z } from "zod";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { searchParams } from "./search-params";
import type {
  DocId,
  QuestionBankName,
  SubjectId,
  LearningObjectiveId,
} from "@chair-flight/core/question-bank";

export type DocSearchResult = {
  id: DocId;
  questionBank: QuestionBankName;
  title: string;
  subject: SubjectId;
  empty: boolean;
  href: string;
  learningObjective: {
    id: LearningObjectiveId;
    href: string;
  };
};

export const docSearchFilters = z.object({
  subject: z.string().default("all"),
  searchField: z.string().default("all"),
});

export type DocSearchFilters = z.infer<typeof docSearchFilters>;

export const docSearchParams = searchParams.and(
  z.object({
    questionBank: questionBankNameSchema,
    filters: docSearchFilters,
  }),
);

export type DocSearchParams = z.infer<typeof docSearchParams>;
