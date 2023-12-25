import type { LearningObjectiveId, MediaId, QuestionId, QuestionVariantId } from "./ids";

export type Media = {
    id: MediaId;
    description: string;
    questions: QuestionId[];
    variants: QuestionVariantId[];
    learningObjectives: LearningObjectiveId[];
}

export type MediaJson = Pick<Media, "id" | "description">;