import { z } from "zod";
import { createTest, newTestConfigurationSchema } from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type {
  LearningObjectiveId,
  QuestionBankLearningObjective,
} from "@chair-flight/base/types";

export const testsRouter = router({
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
      const learningObjectivesMap = learningObjectives.reduce(
        (sum, lo) => {
          sum[lo.id] = lo;
          return sum;
        },
        {} as Record<LearningObjectiveId, QuestionBankLearningObjective>,
      );

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
              numberOfQuestions:
                lo.nestedQuestions.length + lo.questions.length,
              learningObjectives: lo.learningObjectives
                .map((loId2) => {
                  const lo2 = learningObjectivesMap[loId2];
                  if (!lo2) return undefined;
                  if (!allCourses && !lo2.courses.includes(course))
                    return undefined;

                  return {
                    id: lo2.id,
                    text: lo2.text,
                    numberOfQuestions:
                      lo2.nestedQuestions.length + lo2.questions.length,
                  };
                })
                .filter(Boolean),
            };
          })
          .filter(Boolean),
      }));

      return { subjects };
    }),

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
      const test = await createTest({ ...input, questions });
      return { test };
    }),
});
