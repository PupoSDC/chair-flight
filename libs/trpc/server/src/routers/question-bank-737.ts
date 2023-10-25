import { z } from "zod";
import { getEnvVariableOrThrow } from "@chair-flight/base/env";
import { NotFoundError } from "@chair-flight/base/errors";
import { getQuestionPreview } from "@chair-flight/core/app";
import { makeSearchHandler } from "../common/search";
import { publicProcedure, router } from "../config/trpc";
import type { SearchResponseItem } from "../common/search";
import type { QuestionTemplate, Subject } from "@chair-flight/base/types";

const basePath = getEnvVariableOrThrow("NEXT_PUBLIC_BASE_URL");
const SUBJECT_PATH = `${basePath}/content/question-bank-737/subject.json`;
const QUESTIONS_PATH = `${basePath}/content/question-bank-737/questions.json`;

type QuestionPreview = {
  questionId: string;
  variantId: string;
  text: string;
  numberOfVariants: number;
  learningObjectives: string[];
  href: string;
};

let questions: QuestionTemplate[];
let questionsMap: Record<string, QuestionTemplate | undefined>;
let subject: Subject;

const getSubject = async () => {
  if (!subject) {
    const response = await fetch(SUBJECT_PATH);
    subject = (await response.json()) as Subject;
  }
  return subject;
};

const getQuestions = async () => {
  if (!questions) {
    const response = await fetch(QUESTIONS_PATH);
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

const getQuestion = async (questionId: string) => {
  const questions = await getQuestions();
  const question = questions.find((q) => q.id === questionId);
  if (!question) throw new NotFoundError(`Question "${questionId}" not Found!`);
  return question;
};

export const questionBank737Router = router({
  getSubject: publicProcedure.query(getSubject),
  searchQuestions: makeSearchHandler({
    searchFields: ["id", "questionId", "learningObjectives", "text"],
    getData: getQuestions,
    processData: (questions) => {
      return questions.flatMap((question) =>
        Object.values(question.variants).map((variant) => ({
          id: variant.id,
          questionId: question.id,
          learningObjectives: question.learningObjectives.join(", "),
          text: getQuestionPreview(question, variant.id),
        })),
      );
    },
    processResults: (_, searchResults) => {
      const seenQuestions: Record<string, number> = {};
      return searchResults.reduce<SearchResponseItem<QuestionPreview>[]>(
        (sum, result) => {
          const questionId = result["questionId"];
          const variantId = result["id"];
          if (seenQuestions[questionId]) return sum;
          seenQuestions[questionId] = 1;
          const variants = questionsMap[questionId]?.variants;
          sum.push({
            result: {
              questionId: result["questionId"],
              variantId: result["id"],
              text: result["text"],
              numberOfVariants: variants ? Object.values(variants).length : 1,
              learningObjectives: result["learningObjectives"].split(", "),
              href: `/modules/737-type-rating/questions/${questionId}?variantId=${variantId}`,
            },
            score: result.score,
            match: result.match,
            terms: result.terms,
          });
          return sum;
        },
        [],
      );
    },
  }),
  getQuestion: publicProcedure
    .input(z.object({ questionId: z.string() }))
    .query(async ({ input }) => {
      const { questionId } = input;
      const questionTemplate = await getQuestion(questionId);
      const subject = await getSubject();
      const learningObjectives = (subject.children ?? []).filter(
        (lo) => questionTemplate?.learningObjectives.includes(lo.id),
      );
      return { questionTemplate, learningObjectives };
    }),
});
