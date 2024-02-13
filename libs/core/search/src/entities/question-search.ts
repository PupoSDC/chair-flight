import { z } from "zod";
import type { MdDocument } from "@cf/core/markdown";
import type { QuestionBankName, SubjectId } from "@cf/core/question-bank";

export type QuestionSearchResult = {
  id: string;
  questionBank: QuestionBankName;
  subjects: SubjectId[];
  text: MdDocument;
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
