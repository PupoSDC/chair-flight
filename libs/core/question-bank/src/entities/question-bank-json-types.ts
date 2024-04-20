import type { Annex } from './question-bank-annex';
import type { Course } from './question-bank-course';
import type { Doc } from './question-bank-doc';
import type { LearningObjective } from './question-bank-learning-objectives';
import type { QuestionTemplate } from './question-bank-question';
import type { Subject } from './question-bank-subject';

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
