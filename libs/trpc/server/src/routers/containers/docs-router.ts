import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import { getDocsSearchFilters } from "@chair-flight/core/app";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema } from "@chair-flight/core/schemas";
import { compileMdx } from "../../common/compile-mdx";
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
      const parent = rawDoc.parentId
        ? await bank.getOne("docs", rawDoc.parentId)
        : undefined;

      const doc = {
        docMdx,
        title: `[${rawDoc.learningObjectiveId}] ${rawDoc.title}`,
        description: "....",
        isEmpty: rawDoc.empty,
        learningObjective: rawDoc.learningObjectiveId,
        href: `/modules/${input.questionBank}/docs/${rawDoc.id}`,
        parent: parent
          ? {
              href: `/modules/${input.questionBank}/docs/${parent.id}`,
              title: `[${parent.learningObjectiveId}] ${parent.title}`,
            }
          : null,
        children: children.map((child) => ({
          href: `/modules/${input.questionBank}/docs/${child.id}`,
          title: `[${child.learningObjectiveId}] ${child.title}`,
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
