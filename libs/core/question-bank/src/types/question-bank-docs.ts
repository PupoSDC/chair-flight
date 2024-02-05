import type { DocId, LearningObjectiveId, SubjectId } from "./ids";

export type QuestionBankDoc = {
  id: string;
  title: string;
  fileName: string;
  learningObjectiveId: LearningObjectiveId;
  children: DocId[];
  empty: boolean;
  parentId?: DocId;
  subjectId: SubjectId;
  content: string;
};
