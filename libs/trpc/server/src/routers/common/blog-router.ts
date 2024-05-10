import { Content } from "@cf/providers/content";
import { publicProcedure, router } from "../../config/trpc";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const content = new Content();
    const { posts } = await content.getBlogPosts();
    const lastPostDate = posts[0].createdAt;
    return { lastPostDate };
  }),
});
