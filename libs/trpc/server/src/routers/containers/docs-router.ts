import { z } from "zod";
import { makeMap } from "@cf/base/utils";
import { compileMdx } from "@cf/core/markdown";
import { questionBankNameSchema } from "@cf/core/question-bank";
import { docSearch, questionBanks } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const docsContainersRouter = router({
  getDocContent: publicProcedure
    .input(
      z.object({
        questionBank: questionBankNameSchema,
        docId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const bank = questionBanks[input.questionBank];
      const rawDoc = await bank.getOne("docs", input.docId);
      const children = await bank.getSome("docs", rawDoc.docs);
      const docMdx = await compileMdx(rawDoc.content);
      const parent = rawDoc.parentId
        ? await bank.getOne("docs", rawDoc.parentId)
        : undefined;

      const doc = {
        docMdx,
        title: `[${rawDoc.id}] ${rawDoc.title}`,
        isEmpty: rawDoc.empty,
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
        links: {
          search: `/modules/${input.questionBank}/docs`,
          aboutUs: "/blog/000-about-us",
          blog: "/blog",
          github: "/",
        },
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
      const { filters } = await docSearch.getFilters(bank);

      const subjectMap = makeMap(
        filters.subject,
        (s) => s.id,
        (s) => s.text,
      );

      return { subjectMap, filters };
    }),
});
