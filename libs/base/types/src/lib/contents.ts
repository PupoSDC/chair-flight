import type { ContentId, LearningObjectiveId, QuestionTemplateId } from "./ids";

export type Content = {
  id: ContentId;
  title: string;
  text: string;
  questions: QuestionTemplateId[];
  los: LearningObjectiveId[];
};
