import { blog } from "../../common/providers";
import { publicProcedure, router } from "../../config/trpc";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const lastPostDate = await blog.getDateOfLastPost();
    return { lastPostDate };
  }),
});
