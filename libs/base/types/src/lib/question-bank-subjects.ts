import type { LearningObjectiveId } from "./ids";

export type LearningObjectiveSummary = {
  id: LearningObjectiveId;
  text: string;
  numberOfQuestions: number;
  numberOfLearningObjectives: number;
  children?: LearningObjectiveSummary[];
};

export type QuestionBankSubject = {
  id: string;
  longName: string;
  shortName: string;
  numberOfExamQuestions: number;
  numberOfExamMinutes: number;
  numberOfLearningObjectives: number;
  numberOfQuestions: number;
  children?: LearningObjectiveSummary[];
};

export type QuestionBankSubjectJson = Omit<
  QuestionBankSubject,
  "numberOfQuestions" | "numberOfLearningObjectives"
>;
