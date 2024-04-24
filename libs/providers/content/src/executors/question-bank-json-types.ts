import type {
  Annex,
  Course,
  Doc,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/question-bank";

export type QuestionTemplateJson = Pick<
  QuestionTemplate,
  | "id"
  | "relatedQuestions"
  | "externalIds"
  | "annexes"
  | "learningObjectives"
  | "explanation"
  | "variant"
>;

export type LearningObjectiveJson = Pick<
  LearningObjective,
  "id" | "parentId" | "subject" | "courses" | "source" | "text"
>;

export type SubjectJson = Pick<
  Subject,
  | "id"
  | "learningObjective"
  | "numberOfExamMinutes"
  | "numberOfExamQuestions"
  | "shortName"
  | "longName"
>;

export type AnnexJson = Pick<Annex, "id" | "description" | "format" | "source">;

export type DocJson = Pick<
  Doc,
  "id" | "parentId" | "title" | "content" | "fileName" | "description"
>;

export type CourseJson = Course;
