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
let learningObjectivesMap: Record<string, LearningObjective | undefined>;
let subjects: Subject[];

export const getSubjects = async () => {
  if (!subjects) {
    const response = await fetch(API_SUBJECTS_PATH);
    subjects = (await response.json()) as Subject[];
  }
  return subjects;
};

export const getAllQuestionTemplates = async () => {
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

export const getAllQuestionTemplateMap = async () => {
  await getAllQuestionTemplates();
  return questionsMap;
};

export const getSomeQuestionTemplates = async (questionIds: string[]) => {
  const map = await getAllQuestionTemplateMap();
  return questionIds.map((id) => map[id]).filter(Boolean);
};

export const getQuestionTemplate = async (questionId: string) => {
  const questions = await getAllQuestionTemplateMap();
  const question = questions[questionId];
  if (!question) throw new NotFoundError(`Question "${questionId}" not Found!`);
  return question;
};

export const getAllLearningObjectives = async () => {
  if (!learningObjectives) {
    const response = await fetch(API_LEARNING_OBJECTIVES_PATH);
    learningObjectives = (await response.json()) as LearningObjective[];
    learningObjectivesMap = learningObjectives.reduce(
      (s, lo) => {
        s[lo.id] = lo;
        return s;
      },
      {} as typeof learningObjectivesMap,
    );
  }
  return learningObjectives;
};

export const getAllLearningObjectivesMap = async () => {
  await getAllLearningObjectives();
  return learningObjectivesMap;
};

export const getSomeLearningObjectives = async (loIds: string[]) => {
  const map = await getAllLearningObjectivesMap();
  return loIds.map((id) => map[id]).filter(Boolean);
};

export const getLearningObjective = async (learningObjectiveId: string) => {
  const learningObjectiveMap = await getAllLearningObjectivesMap();
  const learningObjective = learningObjectiveMap[learningObjectiveId];
  const errorMessage = `Learning Objective "${learningObjectiveId}" not Found!`;
  if (!learningObjective) throw new NotFoundError(errorMessage);
  return learningObjective;
};

export const getSubject = async (subjectId: string) => {
  const subjects = await getSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) throw new NotFoundError(`Subject "${subjectId}" not Found!`);
  return subject;
};
