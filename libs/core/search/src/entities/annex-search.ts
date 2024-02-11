import { z } from "zod";
import type {
  AnnexId,
  LearningObjectiveId,
  QuestionBankName,
  QuestionTemplateId,
  SubjectId,
} from "@chair-flight/core/question-bank";

export type AnnexSearchResult = {
  id: AnnexId;
  href: string;
  questionBank: QuestionBankName;
  description: string;
  subjects: SubjectId[];
  questions: Array<{ id: QuestionTemplateId; href: string }>;
  learningObjectives: Array<{ id: LearningObjectiveId; href: string }>;
};

export type AnnexSearchField = "id" | "description";
export type AnnexFilterField = "subject";

export const annexSearchFilters = z.object({
  subject: z.string().default("all"),
  course: z.string().default("all"),
  searchField: z.string().default("all"),
});
