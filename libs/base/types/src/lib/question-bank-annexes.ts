import type {
  LearningObjectiveId,
  AnnexId,
  QuestionId,
  QuestionVariantId,
  SubjectId,
} from "./ids";

export type QuestionBankAnnexes = {
  id: AnnexId;
  description: string;
  questions: QuestionId[];
  subjects: SubjectId[]
  variants: QuestionVariantId[];
  learningObjectives: LearningObjectiveId[];
};

export type QuestionBankAnnexesJson = Pick<
  QuestionBankAnnexes,
  "id" | "description" | "subjects"
>;
