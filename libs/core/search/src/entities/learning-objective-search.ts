import { z } from "zod";
import type { MdDocument } from "@cf/core/markdown";
import type {
  CourseId,
  LearningObjectiveId,
  QuestionBankName,
  SubjectId,
} from "@cf/core/question-bank";

export type LearningObjectiveSearchResult = {
  id: LearningObjectiveId;
  questionBank: QuestionBankName;
  href: string;
  parentId: LearningObjectiveId | null;
  courses: Array<{ id: CourseId; text: string }>;
  text: MdDocument;
  source: MdDocument;
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
