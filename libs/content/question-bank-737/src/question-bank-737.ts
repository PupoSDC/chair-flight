import { NotFoundError } from "@chair-flight/base/errors";
import { API_QUESTIONS_PATH, API_SUBJECT_PATH } from "./constants";
import type { QuestionTemplate, Subject } from "@chair-flight/base/types";

let questions: QuestionTemplate[];
let questionsMap: Record<string, QuestionTemplate | undefined>;
let subject: Subject;

export const getSubject = async () => {
  if (!subject) {
    const response = await fetch(API_SUBJECT_PATH);
    subject = (await response.json()) as Subject;
  }
  return subject;
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

export const getQuestionTemplate = async (questionId: string) => {
  const questions = await getAllQuestionTemplates();
  const question = questions.find((q) => q.id === questionId);
  if (!question) throw new NotFoundError(`Question "${questionId}" not Found!`);
  return question;
};
