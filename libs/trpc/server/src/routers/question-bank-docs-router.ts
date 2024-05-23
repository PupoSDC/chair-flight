import { z } from "zod";
import { compileMarkdown } from "@cf/core/markdown";
import { Github, QuestionBank } from "@cf/providers/content";
import { publicProcedure, router } from "../config/trpc";

export const questionBankDocsRouter = router({
  getDoc: publicProcedure
    .input(z.object({ id: z.string(), seed: z.string().default("default") }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const github = new Github();
      const rawDoc = await qb.getOne("docs", input.id);
      const children = await qb.getSome("docs", rawDoc.docs);
      const parent = rawDoc.parentId
        ? await qb.getOne("docs", rawDoc.parentId)
        : undefined;

      const markdown = compileMarkdown(rawDoc.content);
      const repoUrl = github.getRepositoryUrl();

      const doc = {
        markdown,
        title: `[${rawDoc.id}] ${rawDoc.title}`,
        isEmpty: rawDoc.empty,
        parent: parent
          ? {
              href: `/content/docs/${parent.id}`,
              title: `[${parent.id}] ${parent.title}`,
            }
          : null,
        children: children.map((child) => ({
          href: `/content/docs/${child.id}`,
          title: `[${child.id}] ${child.title}`,
          isEmpty: child.empty,
        })),
        links: {
          search: `/content/docs`,
          aboutUs: "/blog/000-about-us",
          blog: "/blog",
          github: `${repoUrl}/blob/main/${rawDoc.fileName}`,
        },
      };

      return { doc };
    }),
  getTopLevelDocs: publicProcedure.query(async () => {
    const qb = new QuestionBank();
    const rawDocs = await qb.getTopLevelDocs();
    const docs = rawDocs.map((rawDoc) => ({
      id: rawDoc.id,
      title: rawDoc.title,
      potato: rawDoc.description,
      docsContained: rawDoc.nestedDocs.length,
      questionBank: rawDoc.questionBank,
      href: `/content/docs/${rawDoc.id}`,
    }));
    return { docs };
  }),
});
