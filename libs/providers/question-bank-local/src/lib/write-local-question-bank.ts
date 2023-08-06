import * as fs from "fs";
import * as path from "path";
import { cwd } from "process";
import type {
  QuestionTemplate,
  QuestionTemplateJson,
} from "@chair-flight/base/types";

const contentPath = "./libs/question-bank/content/src";

export const writeQuestions = (questions: QuestionTemplate[]) => {
  const filesToSave = Object.values(questions).reduce<
    Record<string, QuestionTemplateJson[]>
  >((sum, { srcLocation, ...q }) => {
    const file = Object.values(q.learningObjectives)[0]
      .split(".")
      .slice(0, 2)
      .join(".");
    sum[file] ??= [];
    sum[file].push(q);
    return sum;
  }, {});

  const basePath = path.join(cwd(), contentPath, "questions");
  fs.rmdirSync(path.join(basePath), { recursive: true });

  Object.entries(filesToSave).forEach(([file, questions]) => {
    const dir = file.split(".")[0];

    if (!fs.existsSync(path.join(basePath, dir))) {
      fs.mkdirSync(path.join(basePath, dir), {
        recursive: true,
      });
    }

    fs.writeFileSync(
      path.join(basePath, dir, `${file}.json`),
      JSON.stringify(questions, null, 2),
    );
  });
};
