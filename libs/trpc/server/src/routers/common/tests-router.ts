import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import {
  createTest,
  newTestConfigurationSchema,
} from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { questionBanks } from "../../common/question-banks";
import { publicProcedure, router } from "../../config/trpc";

export const testsRouter = router({
  createTest: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        config: newTestConfigurationSchema,
      }),
    )
    .mutation(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const questions = await qb.getAll("questions");
      const rawTest = await createTest({ ...input, questions });
      const annexIds = rawTest.questions.flatMap((q) => q.annexes);
      const annexes = await qb.getSome("annexes", annexIds);
      const annexesMap = makeMap(annexes, (a) => a.id);
      const test = {
        ...rawTest,
        href: `/modules/${input.questionBank}/tests/${rawTest.id}/${input.config.mode}`,
        questions: rawTest.questions.map((q) => ({
          ...q,
          annexes: q.annexes.map((a) => annexesMap[a].href),
        })),
      };

      return { test };
    }),

  getSubjects: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        course: z.union([z.literal("all"), z.string()]).default("all"),
      }),
    )
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const course = input.course;
      const allCourses = course === "all";
      const rawSubjects = await qb.getAll("subjects");
      const learningObjectives = await qb.getAll("learningObjectives");
      const learningObjectivesMap = makeMap(learningObjectives, (lo) => lo.id);

      const subjects = rawSubjects.map((s) => ({
        ...s,
        learningObjectives: s.learningObjectives
          .map((loId) => {
            const lo = learningObjectivesMap[loId];
            if (!lo) return undefined;
            if (!allCourses && !lo.courses.includes(course)) return undefined;

            return {
              id: lo.id,
              text: lo.text,
              numberOfQuestions: lo.nestedQuestions.length,
              learningObjectives: lo.learningObjectives
                .map((loId2) => {
                  const lo2 = learningObjectivesMap[loId2];
                  if (!lo2) return undefined;
                  if (!allCourses && !lo2.courses.includes(course))
                    return undefined;

                  return {
                    id: lo2.id,
                    text: lo2.text,
                    numberOfQuestions: lo2.nestedQuestions.length,
                  };
                })
                .filter(Boolean),
            };
          })
          .filter(Boolean),
      }));

      return { subjects };
    }),
});
