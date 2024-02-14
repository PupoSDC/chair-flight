import * as fs from "node:fs/promises";
import * as path from "node:path";
import { NOOP } from "@cf/base/utils";
import type {
  Annex,
  Course,
  Doc,
  FlashcardCollection,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/question-bank";
import { getAllFiles } from "./get-all-files";

export const compileQuestionBank = async (args: {
  contentFolder: string;
  compileFolder: string;
  questionTemplates: QuestionTemplate[];
  learningObjectives: LearningObjective[];
  courses: Course[];
  subjects: Subject[];
  annexes: Annex[];
  docs: Doc[];
  flashcards: FlashcardCollection[]
}) => {
  const allMedia = [...(await getAllFiles(args.compileFolder, ".jpg"))];

  await fs
    .rm(path.join(args.contentFolder), { recursive: true })
    .catch(NOOP); 

  await Promise.all([
    fs.writeFile(
      path.join(args.contentFolder, "questions.json"),
      JSON.stringify(args.questionTemplates),
    ),
    fs.writeFile(
      path.join(args.contentFolder, "annexes.json"),
      JSON.stringify(args.annexes),
    ),
    fs.writeFile(
      path.join(args.contentFolder, "learning-objectives.json"),
      JSON.stringify(args.learningObjectives),
    ),
    fs.writeFile(
      path.join(args.contentFolder, "docs.json"),
      JSON.stringify(args.docs),
    ),
    fs.writeFile(
      path.join(args.contentFolder, "courses.json"),
      JSON.stringify(args.courses),
    ),
    fs.writeFile(
      path.join(args.contentFolder, "subjects.json"),
      JSON.stringify(args.subjects),
    ),
    fs.writeFile(
      path.join(args.contentFolder, "flashcards.json"),
      JSON.stringify(args.flashcards),
    ),
    ...allMedia.map((file) => fs.cp(
      file,
      path.join(args.compileFolder, "media", file.split("/").pop() ?? ".")
    ))
  ]);
};
