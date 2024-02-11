import { z } from "zod";
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

export type QuestionSearchField =
  | "id"
  | "learningObjective"
  | "externalId"
  | "text";

export type QuestionFilterField = "subject";

export const questionSearchFilters = z.object({
  subject: z.string().default("all"),
  searchField: z.string().default("all"),
});
