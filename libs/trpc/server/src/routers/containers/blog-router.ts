import { z } from "zod";
import { compileMdx } from "@cf/core/markdown";
import { Github } from "@cf/providers/github";
import { publicProcedure, router } from "../../config/trpc";

export const blogContainersRouter = router({
  getBlogPost: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const github = new Github();
      const rawPost = await github.getBlogPost(input.postId);
      const mdxContent = await compileMdx(rawPost.content);

      const post = {
        mdxContent,
        title: rawPost.title,
        description: rawPost.description,
        tag: rawPost.tag,
        date: rawPost.date,
        tagHref: `/blog?tag=${rawPost.tag}`,
      };

      return { post };
    }),
  getBlogIndex: publicProcedure.input(z.object({})).query(async () => {
    const github = new Github();
    const { posts } = await github.getBlogPosts();
    const meta = posts.map(({ content, ...meta }) => meta);
    return { meta };
  }),
});
