import { DateTime } from "luxon";
import { blog } from "@chair-flight/core/blog";
import { publicProcedure, router } from "../config/trpc";

const A_LONG_TIME_AGO = "2020-01-01T00:00:00.000";

export const blogRouter = router({
  getDateOfLastPost: publicProcedure.query(async () => {
    const meta = await blog.getAllPostsMeta();
    const date = meta.at(0)?.date ?? A_LONG_TIME_AGO;
    const lastPostDate = DateTime.fromISO(date).toISO() ?? A_LONG_TIME_AGO;
    return { lastPostDate };
  }),
  getBlogPostsMeta: publicProcedure.query(async () => {
    const meta = await blog.getAllPostsMeta();
    return { meta };
  }),
});
