import { z } from "zod";
import {
  getSubject,
  getQuestion,
  getQuestions,
} from "@chair-flight/content/question-bank-737";
import { getQuestionPreview } from "@chair-flight/core/app";
import { makeSearchHandler } from "../common/search";
import { publicProcedure, router } from "../config/trpc";
import type { SearchResponseItem } from "../common/search";

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
