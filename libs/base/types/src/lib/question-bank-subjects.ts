import type { CourseId, LearningObjectiveId, QuestionTemplateId, SubjectId } from "./ids";

export type QuestionBankCourse = {
  id: CourseId;
  text: string;
}

export type QuestionBankSubject = {
  id: SubjectId;
  courses: CourseId[];
  longName: string;
  shortName: string;
  numberOfExamQuestions: number;
  numberOfExamMinutes: number;
  learningObjectives: LearningObjectiveId[];
  nestedLearningObjectives: LearningObjectiveId[];
  questions: QuestionTemplateId[];
  nestedQuestions: QuestionTemplateId[];
};

export type QuestionBankLearningObjective = {
  id: LearningObjectiveId;
  courses: CourseId[];
  text: string;
  source: string;
  learningObjectives: LearningObjectiveId[];
  nestedLearningObjectives: LearningObjectiveId[];
  questions: QuestionTemplateId[];
  nestedQuestions: QuestionTemplateId[];
}

export type QuestionBankCourseJson = QuestionBankCourse;

export type QuestionBankSubjectJson = Omit<
  QuestionBankSubject,
  "questions" | "nestedQuestions" | "nestedLearningObjectives"
>;

export type QuestionBankLearningObjectiveJson = Omit<
  QuestionBankLearningObjective,
  "questions"  | "nestedQuestions" | "nestedLearningObjectives"
>
