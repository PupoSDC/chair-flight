import type { LearningObjectiveId, QuestionTemplateId } from "./ids";

export type CourseName =
  | "ATPL_A"
  | "CPL_A"
  | "ATPL_H_IR"
  | "ATPL_H_VFR"
  | "CPL_H"
  | "IR"
  | "CBIR_A";

export type LearningObjective = {
  id: LearningObjectiveId;
  courses: CourseName[];
  questions: QuestionTemplateId[];
  text: string;
  contentId: string;
  source: string;
};

export type LearningObjectiveWithHref = LearningObjective & {
  href: string;
};
