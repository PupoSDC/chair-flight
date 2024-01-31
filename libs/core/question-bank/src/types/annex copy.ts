import type * as ID from "./ids";

export type Annex = {
  id: ID.AnnexId;
  format: string;
  href: string;
  description: string;
  questions: ID.QuestionId[];
  subjects: ID.SubjectId[];
  variants: ID.QuestionVariantId[];
  learningObjectives: ID.LearningObjectiveId[];
};

export type AnnexJson = Pick<Annex, "id" | "description" | "format">;
