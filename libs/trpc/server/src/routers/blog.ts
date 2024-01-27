import { DateTime } from "luxon";
import { z } from "zod";
import { blog } from "@chair-flight/core/blog";
import { compileMdx } from "../common/compile-mdx";
import { publicProcedure, router } from "../config/trpc";

const A_LONG_TIME_AGO = "2020-01-01T00:00:00.000";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const meta = await blog.getAllPosts();
    const date = meta.at(0)?.date ?? A_LONG_TIME_AGO;
    const lastPostDate = DateTime.fromISO(date).toISO() ?? A_LONG_TIME_AGO;
    return { lastPostDate };
  }),
  getBlogPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const meta = await blog.getPost(input.postId);
      const mdxContent = await compileMdx(meta.content);

      const post = {
        mdxContent,
        title: meta.title,
        description: meta.description,
        tag: meta.tag,
        date: meta.date,
        tagHref: `/blog?tag=${meta.tag}`,
      };

      return { post };
    }),
  getBlogPostsMeta: publicProcedure.query(async () => {
    const allPosts = await blog.getAllPosts();
    const meta = allPosts.map(({ content, ...meta }) => meta);
    return { meta };
  }),
});
