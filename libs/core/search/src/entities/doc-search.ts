import { z } from "zod";
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
  learningObjectives: Array<{
    id: LearningObjectiveId;
    href: string;
  }>;
};

export type DocSearchField = "id" | "learningObjective" | "content" | "title";
export type DocFilterField = "subject";

export const docSearchFilters = z.object({
  subject: z.string().default("all"),
  searchField: z.string().default("all"),
});
