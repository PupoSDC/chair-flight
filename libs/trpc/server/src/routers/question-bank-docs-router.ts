import { z } from "zod";
import { InvalidData } from "@cf/base/errors";
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
        links: {
          search: `/content/docs`,
          aboutUs: "/blog/000-about-us",
          blog: "/blog",
          github: `${repoUrl}/blob/main/${rawDoc.fileName}`,
        },
      };

      return { doc };
    }),
  getDocToc: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const qb = new QuestionBank();
      const rawDoc = await qb.getOne("docs", input.id);
      const rawRootDoc = await qb.getOne("docs", rawDoc.rootDocId);
      if (!rawRootDoc.rootDocToc) {
        throw new InvalidData("Root Doc is missing TOC table.");
      }

      const toc = rawRootDoc.rootDocToc.map((item) => ({
        id: item.id,
        title: item.title,
        href: `/content/docs/${item.id}`,
        nestedDocs: item.nestedDocs.map((nestedItem) => ({
          id: nestedItem.id,
          title: nestedItem.title,
          href: `/content/docs/${nestedItem.id}`,
        })),
      }));

      const root = {
        id: rawRootDoc.id,
        title: rawRootDoc.title,
        href: `/content/docs/${rawRootDoc.id}`,
      };

      const library = {
        title: "Library",
        href: "/content/docs",
      };

      return { toc, root, library };
    }),
  getTopLevelDocs: publicProcedure.query(async () => {
    const qb = new QuestionBank();
    const rawDocs = await qb.getTopLevelDocs();
    const docs = rawDocs.map((rawDoc) => ({
      id: rawDoc.id,
      title: rawDoc.title,
      potato: rawDoc.description,
      docsContained: rawDoc.rootDocToc?.reduce((s, e) => {
        return s + 1 + e.nestedDocs.length;
      }, 0),
      questionBank: rawDoc.questionBank,
      href: `/content/docs/${rawDoc.id}`,
    }));
    return { docs };
  }),
});
