import { z } from "zod";
import type {
  CourseId,
  LearningObjectiveId,
  QuestionBankName,
  SubjectId,
} from "@chair-flight/core/question-bank";

export type LearningObjectiveSearchResult = {
  id: LearningObjectiveId;
  questionBank: QuestionBankName;
  href: string;
  parentId: LearningObjectiveId | CourseId;
  courses: Array<{ id: CourseId; text: string }>;
  text: string;
  source: string;
  subject: SubjectId;
  numberOfQuestions: number;
};

export type LearningObjectiveSearchField = "id" | "text";

export type LearningObjectiveFilterField = "subject" | "course";

export const learningObjectiveSearchFilters = z.object({
  subject: z.string().default("all"),
  course: z.string().default("all"),
  searchField: z.string().default("all"),
});
