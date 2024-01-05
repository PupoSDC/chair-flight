import { questionBanks } from "@chair-flight/core/question-bank";

export const preloadContentForStaticRender = (fs: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) =>
  Promise.all(
    Object.values(questionBanks).map((qb) => qb.preloadForStaticRender(fs)),
  );
