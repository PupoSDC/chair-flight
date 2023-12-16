import { NotFoundError } from "@chair-flight/base/errors";
import {
  API_PATH_QUESTIONS,
  API_PATH_SUBJECT,
  READ_PATH_QUESTIONS,
  READ_PATH_SUBJECT,
} from "./constants";
import type { QuestionTemplate, Subject } from "@chair-flight/base/types";

type QuestionsMap = Record<string, QuestionTemplate | undefined>;

let questions: QuestionTemplate[];
let questionsMap: Record<string, QuestionTemplate | undefined>;
let subject: Subject;

export const getSubject = async () => {
  if (!subject) {
    const response = await fetch(API_PATH_SUBJECT);
    subject = (await response.json()) as Subject;
  }
  return subject;
};

export const getAllQuestionTemplates = async () => {
  if (!questions) {
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

export const getQuestionTemplate = async (questionId: string) => {
  const questions = await getAllQuestionTemplates();
  const question = questions.find((q) => q.id === questionId);
  if (!question) throw new NotFoundError(`Question "${questionId}" not Found!`);
  return question;
};

export const preloadQuestionBankA320ForStaticRender = async ({
  readFile,
}: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) =>
  Promise.all([
    (async () => {
      const path = `${process.cwd()}${READ_PATH_SUBJECT}`;
      const file = JSON.parse(await readFile(path, "utf-8"));
      subject = file as Subject;
    })(),
    (async () => {
      const path = `${process.cwd()}${READ_PATH_QUESTIONS}`;
      const file = JSON.parse(await readFile(path, "utf-8"));
      questions = file as QuestionTemplate[];
    })(),
  ]);
