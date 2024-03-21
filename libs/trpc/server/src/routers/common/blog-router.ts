import { Github } from "@cf/providers/github";
import { publicProcedure, router } from "../../config/trpc";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const github = new Github();
    const posts = await github.getBlogPosts();
    const lastPost = posts.posts[0];
    const lastPostDate = lastPost.date;
    return { lastPostDate };
  }),
});
