import { NotFoundError } from "@chair-flight/base/errors";
import {
  API_LEARNING_OBJECTIVES_PATH,
  API_QUESTIONS_PATH,
  API_SUBJECTS_PATH,
} from "./contants";
import type {
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@chair-flight/base/types";

let questions: QuestionTemplate[];
let questionsMap: Record<string, QuestionTemplate | undefined>;
let learningObjectives: LearningObjective[];
let subjects: Subject[];

export const getSubjects = async () => {
  if (!subjects) {
    const response = await fetch(API_SUBJECTS_PATH);
    subjects = (await response.json()) as Subject[];
  }
  return subjects;
};

export const getQuestions = async () => {
  if (!questions) {
    const response = await fetch(API_QUESTIONS_PATH);
    questions = (await response.json()) as QuestionTemplate[];
    questionsMap = questions.reduce(
      (s, q) => {
        s[q.id] = q;
        return s;
      },
      {} as typeof questionsMap,
    );
  }
  return questions;
};

export const getQuestionsMap = async () => {
  await getQuestions();
  return questionsMap;
};

export const getQuestion = async (questionId: string) => {
  const questions = await getQuestionsMap();
  const question = questions[questionId];
  if (!question) throw new NotFoundError(`Question "${questionId}" not Found!`);
  return question;
};

export const getAllLearningObjectives = async () => {
  if (!learningObjectives) {
    const response = await fetch(API_LEARNING_OBJECTIVES_PATH);
    learningObjectives = (await response.json()) as LearningObjective[];
  }
  return learningObjectives;
};

export const getSubject = async (subjectId: string) => {
  const subjects = await getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) throw new NotFoundError(`Subject "${subjectId}" not Found!`);
  return subject;
};

export const getSubjectLearningObjectives = async (subjectId: string) => {
  const subject = await getSubject(subjectId);
  const learningObjectives = subject.children ?? [];
  return learningObjectives;
};
