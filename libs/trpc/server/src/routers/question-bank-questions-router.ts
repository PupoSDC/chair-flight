import { z } from "zod";
import { makeMap } from "@cf/base/utils";
import { getQuestionPreview } from "@cf/core/content";
import { compileMarkdown } from "@cf/core/markdown";
import { createTestQuestion } from "@cf/core/progress";
import { QuestionBank } from "@cf/providers/content";
import { publicProcedure, router } from "../config/trpc";

export const questionBankQuestionsRouter = router({
  getStandalone: publicProcedure
    .input(z.object({ id: z.string(), seed: z.string().default("default") }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      const rawAnnexes = await qb.getSome("annexes", template.annexes);
      const rawQuestion = createTestQuestion(template, { seed: input.seed });
      const annexes = rawAnnexes.map((a) => ({ id: a.id, href: a.href }));
      const { explanation, question, options, ...other } = rawQuestion;

      return {
        annexes,
        question: {
          ...other,
          question: compileMarkdown(question),
          options: options.map((opt) => ({
            ...opt,
            text: compileMarkdown(opt.text),
          })),
        },
      };
    }),
  getExplanation: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      if (!template.explanation) return { explanation: null };
      const explanation = compileMarkdown(template.explanation);
      return { explanation };
    }),
  getPreview: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      const rawPreview = getQuestionPreview(template.variant);
      const preview = compileMarkdown(rawPreview);
      return { preview };
    }),
  getLearningObjectives: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      const loIds = template.learningObjectives;
      const rawLos = await qb.getSome("learningObjectives", loIds);
      const courseIds = rawLos.flatMap((lo) => lo.courses);
      const courses = await qb.getSome("courses", courseIds);
      const coursesMap = makeMap(courses, (c) => c.id);
      const learningObjectives = rawLos.map((lo) => ({
        id: lo.id,
        subject: lo.subject,
        title: compileMarkdown(lo.text),
        source: compileMarkdown(lo.source),
        numberOfQuestions: lo.questions.length,
        href: `/content/learning-objectives/${lo.id}`,
        courses: lo.courses.map((c) => coursesMap[c]),
      }));
      return { learningObjectives };
    }),
  getExternalReferences: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const template = await qb.getOne("questions", input.id);
      const externalReferences = template.externalIds.map((ref) => ({
        id: ref,
      }));
      return { externalReferences };
    }),
});
