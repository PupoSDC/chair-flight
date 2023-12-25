import type {
  LearningObjectiveId,
  MediaId,
  QuestionId,
  QuestionVariantId,
} from "./ids";

export type QuestionBankMedia = {
  id: MediaId;
  description: string;
  questions: QuestionId[];
  variants: QuestionVariantId[];
  learningObjectives: LearningObjectiveId[];
};

export type QuestionBankMediaJson = Pick<
  QuestionBankMedia,
  "id" | "description"
>;
