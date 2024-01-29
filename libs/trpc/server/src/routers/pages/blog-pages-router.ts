import { z } from "zod";
import { blog } from "@chair-flight/core/blog";
import { publicProcedure, router } from "../../config/trpc";

export const blogPagesRouter = router({
  getBlogPostMeta: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ input }) => {
      const data = await blog.getPost(input.postId);
      const meta = {
        title: data.title,
        linkTitle: data.title,
        description: data.description,
      };

      return { meta };
    }),
  getBlogPostGenerationPaths: publicProcedure.query(async () => {
    const allPosts = await blog.getAllPosts();
    const posts = allPosts.map(({ filename: postId }) => postId);
    return posts.map((postId) => ({ params: { postId } }));
  }),
});
