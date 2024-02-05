import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseLearningObjectivesXlsx } from "../../src/executors/parse-learning-objectives-xlsx";

type ExecutorOptions = {
  xlsxPath: string;
  outputJsonPath: string;
};

const runExecutor = async (options: ExecutorOptions) => {
  const { xlsxPath, outputJsonPath } = options;

  const learningObjectives = await parseLearningObjectivesXlsx({
    xlsxPath,
  });

  await fs.writeFile(
    path.join(process.cwd(), outputJsonPath),
    JSON.stringify(learningObjectives, undefined, 2),
  );

  return {
    success: true,
  };
};

export default runExecutor;
