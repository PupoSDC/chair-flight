import { z } from "zod";
import { blog } from "@chair-flight/providers/blog";
import { compileMdx } from "../../common/compile-mdx";
import { publicProcedure, router } from "../../config/trpc";

export const blogContainersRouter = router({
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
  getBlogIndex: publicProcedure.input(z.object({})).query(async () => {
    const allPosts = await blog.getAllPosts();
    const meta = allPosts.map(({ content, ...meta }) => meta);
    return { meta };
  }),
});
