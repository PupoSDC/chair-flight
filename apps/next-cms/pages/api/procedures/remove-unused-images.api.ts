import { default as fs } from "fs";
import { default as path } from "path";
import { apiHandler } from "@chair-flight/next/server";

export default apiHandler(
  {
    post: async ({ questionBank }) => {
      const imagesInQuestions = (
        await questionBank.getAllQuestionTemplates()
      ).reduce<string[]>((acc, template) => {
        Object.values(template.variants).forEach((variant) => {
          variant.annexes.forEach((annex) =>
            acc.push(annex.split("/").pop() ?? ""),
          );
        });
        return acc;
      }, []);

      fs.readdirSync(
        path.join(process.cwd(), "libs", "question-bank", "content", "media"),
      )
        .filter((image) => !imagesInQuestions.includes(image))
        .forEach((image) =>
          fs.rmSync(
            path.join(
              process.cwd(),
              "libs",
              "question-bank",
              "content",
              "media",
              image,
            ),
          ),
        );

      return "ok";
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  },
);
