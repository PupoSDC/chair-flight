import { Blog } from "@cf/providers/content";
import { publicProcedure, router } from "../../config/trpc";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const blog = new Blog();
    const { posts } = await blog.getBlogPosts();
    const lastPostDate = posts[0].createdAt;
    return { lastPostDate };
  }),
});
