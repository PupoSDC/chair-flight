import type {
  CourseId,
  LearningObjectiveId,
  QuestionTemplateId,
  SubjectId,
} from "./ids";

export type QuestionBankCourse = {
  id: CourseId;
  text: string;
};

export type QuestionBankSubject = {
  id: SubjectId;
  courses: CourseId[];
  longName: string;
  shortName: string;
  numberOfExamQuestions: number;
  numberOfExamMinutes: number;
  numberOfQuestions: number;
  learningObjectives: LearningObjectiveId[];
};

export type QuestionBankLearningObjective = {
  id: LearningObjectiveId;
  parentId: LearningObjectiveId | CourseId;
  courses: CourseId[];
  text: string;
  source: string;
  learningObjectives: LearningObjectiveId[];
  questions: QuestionTemplateId[];
  /** Includes Questions from this LO and from nested LOs */
  nestedQuestions: QuestionTemplateId[];
};

export type QuestionBankCourseJson = QuestionBankCourse;

export type QuestionBankSubjectJson = Omit<
  QuestionBankSubject,
  "numberOfQuestions"
>;

export type QuestionBankLearningObjectiveJson = Omit<
  QuestionBankLearningObjective,
  "questions" | "nestedQuestions"
>;
