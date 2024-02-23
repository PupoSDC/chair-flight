import { Blog } from "@cf/providers/blog";
import { publicProcedure, router } from "../config/trpc";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const blog = Blog.get();
    const lastPostDate = await blog.getDateOfLastPost();
    return { lastPostDate };
  }),
});
