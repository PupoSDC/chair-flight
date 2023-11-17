import { NotFoundError } from "@chair-flight/base/errors";
import {
  API_PATH_LOS,
  API_PATH_QUESTIONS,
  API_PATH_SUBJECTS,
  READ_PATH_LOS,
  READ_PATH_QUESTIONS,
  READ_PATH_SUBJECTS,
} from "./contants";
import type {
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@chair-flight/base/types";

type QuestionsMap = Record<string, QuestionTemplate | undefined>;
type LearningObjectivesMap = Record<string, LearningObjective | undefined>;

let questions: QuestionTemplate[];
let questionsMap: Record<string, QuestionTemplate | undefined>;
let learningObjectives: LearningObjective[];
let learningObjectivesMap: LearningObjectivesMap;
let subjects: Subject[];

export const getAllQuestionTemplates = async () => {
  if (!questions) {
    console.log(API_PATH_QUESTIONS);
    const response = await fetch(API_PATH_QUESTIONS);
    questions = (await response.json()) as QuestionTemplate[];
  }
  return questions;
};

export const getAllQuestionTemplateMap = async () => {
  if (!questionsMap) {
    const questions = await getAllQuestionTemplates();
    questionsMap = questions.reduce<QuestionsMap>((s, q) => {
      s[q.id] = q;
      return s;
    }, {});
  }
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
    const response = await fetch(API_PATH_LOS);
    learningObjectives = (await response.json()) as LearningObjective[];
  }
  return learningObjectives;
};

export const getAllLearningObjectivesMap = async () => {
  if (!learningObjectivesMap) {
    const learningObjectives = await getAllLearningObjectives();
    learningObjectivesMap = learningObjectives.reduce<LearningObjectivesMap>(
      (s, lo) => {
        s[lo.id] = lo;
        return s;
      },
      {} as typeof learningObjectivesMap,
    );
  }

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

export const getAllSubjects = async () => {
  if (!subjects) {
    const response = await fetch(API_PATH_SUBJECTS);
    subjects = (await response.json()) as Subject[];
  }
  return subjects;
};

export const getSubject = async (subjectId: string) => {
  const subjects = await getAllSubjects();
  const subject = subjects.find((s) => s.id === subjectId);
  if (!subject) throw new NotFoundError(`Subject "${subjectId}" not Found!`);
  return subject;
};

export const preloadQuestionBankAtplForStaticRender = async ({
  readFile,
}: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) =>
  Promise.all([
    (async () => {
      const path = `${process.cwd()}${READ_PATH_SUBJECTS}`;
      const file = JSON.parse(await readFile(path, "utf-8"));
      subjects = file as Subject[];
    })(),
    (async () => {
      const path = `${process.cwd()}${READ_PATH_QUESTIONS}`;
      const file = JSON.parse(await readFile(path, "utf-8"));
      questions = file as QuestionTemplate[];
    })(),
    (async () => {
      const path = `${process.cwd()}${READ_PATH_LOS}`;
      const file = JSON.parse(await readFile(path, "utf-8"));
      learningObjectives = file as LearningObjective[];
    })(),
  ]);
