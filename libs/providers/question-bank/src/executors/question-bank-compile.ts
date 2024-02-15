import * as fs from "node:fs/promises";
import * as path from "node:path";
import { NOOP } from "@cf/base/utils";
import { getAllFiles } from "./get-all-files";
import type {
  Annex,
  Course,
  Doc,
  FlashcardCollection,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/question-bank";

export const compileQuestionBank = async (args: {
  contentFolder: string;
  compileFolder: string;
  questionTemplates: QuestionTemplate[];
  learningObjectives: LearningObjective[];
  courses: Course[];
  subjects: Subject[];
  annexes: Annex[];
  docs: Doc[];
  flashcards: FlashcardCollection[];
}) => {
  const allMedia = [...(await getAllFiles(args.contentFolder, ".jpg"))];

  await fs.rm(path.join(args.compileFolder), { recursive: true }).catch(NOOP);

  await fs.mkdir(args.compileFolder, { recursive: true });

  await Promise.all([
    fs.writeFile(
      path.join(args.compileFolder, "questions.json"),
      JSON.stringify(args.questionTemplates),
    ),
    fs.writeFile(
      path.join(args.compileFolder, "annexes.json"),
      JSON.stringify(args.annexes),
    ),
    fs.writeFile(
      path.join(args.compileFolder, "learningObjectives.json"),
      JSON.stringify(args.learningObjectives),
    ),
    fs.writeFile(
      path.join(args.compileFolder, "docs.json"),
      JSON.stringify(args.docs),
    ),
    fs.writeFile(
      path.join(args.compileFolder, "courses.json"),
      JSON.stringify(args.courses),
    ),
    fs.writeFile(
      path.join(args.compileFolder, "subjects.json"),
      JSON.stringify(args.subjects),
    ),
    fs.writeFile(
      path.join(args.compileFolder, "flashcards.json"),
      JSON.stringify(args.flashcards),
    ),
    ...allMedia.map((file) =>
      fs.cp(
        file,
        path.join(args.compileFolder, "media", file.split("/").pop() ?? "."),
      ),
    ),
  ]);
};
