import { z } from "zod";
import {
  createNewQuestionPr,
  getQuestionFromGit,
} from "@chair-flight/core/github";
import { questionBanks } from "@chair-flight/core/question-bank";
import {
  questionBankNameSchema as questionBank,
  questionEditSchema,
} from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type { AnnexId } from "@chair-flight/base/types";

export const questionBankQuestionsRouter = router({
  getQuestionOverview: publicProcedure
    .input(z.object({ questionBank, questionId: z.string() }))
    .query(async ({ input }) => {
      const id = input.questionId;
      const qb = questionBanks[input.questionBank];
      const template = await qb.getOne("questions", id);
      const loIds = template.learningObjectives;
      const annexIds = Object.values(template.variants).flatMap(
        (v) => v.annexes,
      );
      const rawAnnexes = await qb.getSome("annexes", annexIds);
      const rawLos = await qb.getSome("learningObjectives", loIds);
      const editLink = `/modules/${questionBank}/questions/${id}/edit`;

      const annexes = rawAnnexes.reduce(
        (sum, annex) => {
          sum[annex.id] = {
            id: annex.id,
            href: annex.href,
          };
          return sum;
        },
        {} as Record<AnnexId, { id: string; href: string }>,
      );

      const learningObjectives = rawLos.map((lo) => ({
        id: lo.id,
        text: lo.text,
        href: `/modules/${questionBank}/learning-objectives/${lo.id}`,
      }));

      return { template, annexes, learningObjectives, editLink };
    }),
  getQuestionFromGithub: publicProcedure
    .input(z.object({ questionBank, questionId: z.string() }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const question = await qb.getOne("questions", input.questionId);
      const questionTemplate = await getQuestionFromGit({
        questionId: question.id,
        srcLocation: question.srcLocation,
      });
      return { questionTemplate };
    }),
  updateQuestion: publicProcedure
    .input(questionEditSchema)
    .mutation(async ({ input }) => {
      return createNewQuestionPr(input);
    }),
});
