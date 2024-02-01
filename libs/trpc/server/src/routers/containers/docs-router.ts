import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import { getDocsSearchFilters } from "@chair-flight/core/search";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/question-bank";
import { compileMdx } from "@chair-flight/core/mdx";
import { publicProcedure, router } from "../../config/trpc";

export const docsContainersRouter = router({
  getDoc: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        docId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const rawDoc = await bank.getOne("docs", input.docId);
      const children = await bank.getSome("docs", rawDoc.children);
      const docMdx = await compileMdx(rawDoc.content);
      const parent = rawDoc.parent
        ? await bank.getOne("docs", rawDoc.parent)
        : undefined;

      const doc = {
        docMdx,
        title: `[${rawDoc.id}] ${rawDoc.title}`,
        description: "....",
        isEmpty: rawDoc.empty,
        learningObjectives: rawDoc.learningObjectives,
        href: `/modules/${input.questionBank}/docs/${rawDoc.id}`,
        parent: parent
          ? {
              href: `/modules/${input.questionBank}/docs/${parent.id}`,
              title: `[${parent.id}] ${parent.title}`,
            }
          : null,
        children: children.map((child) => ({
          href: `/modules/${input.questionBank}/docs/${child.id}`,
          title: `[${child.id}] ${child.title}`,
          isEmpty: child.empty,
        })),
      };
      return { doc };
    }),
  getDocSearch: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const filters = await getDocsSearchFilters(bank);
      const subjects = filters.subjects;
      const subjectMap = makeMap(
        subjects,
        (s) => s.id,
        (s) => s.text,
      );

      return { subjectMap, filters };
    }),
});
