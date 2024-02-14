import * as fs from "node:fs/promises";
import * as path from "node:path";
import { NOOP } from "@cf/base/utils";
import type {
  Annex,
  Course,
  Doc,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/question-bank";

export const compileQuestionBank = async (
  outputFolder: string,
  questionBank: {
    questionTemplates: QuestionTemplate[];
    learningObjectives: LearningObjective[];
    courses: Course[];
    subjects: Subject[];
    annexes: Annex[];
    docs: Doc[];
  },
) => {
  await fs
    .rm(path.join(process.cwd(), outputFolder), { recursive: true })
    .catch(NOOP);

  await fs.writeFile(
    path.join(process.cwd(), path.join(outputFolder), "questions.json"),
    JSON.stringify(questionBank.questionTemplates),
  );
  await fs.writeFile(
    path.join(process.cwd(), path.join(outputFolder), "annexes.json"),
    JSON.stringify(questionBank.annexes),
  );
  await fs.writeFile(
    path.join(
      process.cwd(),
      path.join(outputFolder),
      "learning-objectives.json",
    ),
    JSON.stringify(questionBank.learningObjectives),
  );
  await fs.writeFile(
    path.join(process.cwd(), path.join(outputFolder), "docs.json"),
    JSON.stringify(questionBank.docs),
  );
  await fs.writeFile(
    path.join(process.cwd(), path.join(outputFolder), "courses.json"),
    JSON.stringify(questionBank.courses),
  );
  await fs.writeFile(
    path.join(process.cwd(), path.join(outputFolder), "subjects.json"),
    JSON.stringify(questionBank.subjects),
  );
};
