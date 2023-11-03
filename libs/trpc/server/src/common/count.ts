import { publicProcedure } from "../config/trpc";

export const makeCountHandler = ({
  getData,
}: {
  getData: () => Promise<unknown[]>;
}) =>
  publicProcedure.query(async () => {
    const data = await getData();
    return { count: data.length };
  });
