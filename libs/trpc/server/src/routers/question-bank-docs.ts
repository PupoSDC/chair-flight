import { compile } from "@mdx-js/mdx";
import rehypeKatex from "rehype-katex";
import { default as remarkGfm } from "remark-gfm";
import remarkMath from "remark-math";
import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type { QuestionBankName } from "@chair-flight/base/types";

const MATCH_CODE_BLOCKS = /```tsx eval((?:.|\n)*?)```/g;

type Path = {
  params: {
    questionBank: QuestionBankName;
    docId: string;
  };
};

export const questionBankDocsRouter = router({
  getAllDocPaths: publicProcedure.query(async () => {
    const bankNames: QuestionBankName[] = ["atpl"];
    const paths: Path[] = [];
    for (const questionBank of bankNames) {
      const qb = questionBanks[questionBank];
      const docs = await qb.getAll("docs");
      paths.push(
        ...docs.map((doc) => ({
          params: {
            docId: doc.id,
            questionBank,
          },
        })),
      );
    }
    return { paths };
  }),
  getDoc: publicProcedure
    .input(z.object({ questionBank, docId: z.string() }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];
      const rawDoc = await qb.getOne("docs", input.docId);
      const children = await qb.getSome("docs", rawDoc.children);
      const parent = rawDoc.parentId
        ? await qb.getOne("docs", rawDoc.parentId)
        : undefined;

      const content = rawDoc.content;
      const sourceString = content.replaceAll(MATCH_CODE_BLOCKS, "$1");

      const mdxSource = String(
        await compile(sourceString, {
          outputFormat: "function-body",
          providerImportSource: "@mdx-js/react",
          remarkPlugins: [remarkMath, remarkGfm],
          rehypePlugins: [rehypeKatex],
        }),
      );

      const doc = {
        title: `[${rawDoc.learningObjectiveId}] ${rawDoc.title}`,
        description: "....",
        mdxSource: mdxSource,
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
});
