import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parse } from "yaml";
import { getAllFiles } from "./get-all-files";
import type {
  AnnexJson,
  CourseJson,
  DocJson,
  LearningObjectiveJson,
  QuestionTemplateJson,
  SubjectJson,
} from "./json-types";
import type {
  FlashcardCollection,
  FlashcardContent,
} from "@cf/core/question-bank";

const MATTER_REGEX =
  /^---(?:\r?\n|\r)(?:([\s\S]*?)(?:\r?\n|\r))?---(?:\r?\n|\r|$)/;

const exists = async (f: string) => {
  try {
    await fs.stat(f);
    return true;
  } catch {
    return false;
  }
};

export const readAllDocsFromFs = async (contentFolder: string) => {
  const posts = await getAllFiles(contentFolder, "page.md");
  const docs: DocJson[] = [];

  for (const fileName of posts) {
    const source = (await fs.readFile(fileName)).toString();
    const match = MATTER_REGEX.exec(source);
    if (!match) throw new Error(`Missing frontMatter for ${fileName}`);
    const data = parse(match[1]);
    const content = source.split("\n---").slice(1).join().trim();
    const doc: DocJson = {
      id: data.id,
      parentId: data.parent,
      title: data.title,
      fileName: fileName,
      content: content,
    };
    docs.push(doc);
  }

  return docs.sort((a, b) => a.id.localeCompare(b.id));
};

export const readAllQuestionsFromFs = async (contentFolder: string) => {
  const files = await getAllFiles(contentFolder, "questions.json");
  const questions: QuestionTemplateJson[] = [];

  for (const filePath of files) {
    const json = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(json) as QuestionTemplateJson[];
    questions.push(...jsonData);
  }

  return questions;
};

export const readAllAnnexesFromFs = async (contentFolder: string) => {
  const files = await getAllFiles(contentFolder, "annexes.json");
  const annexes: AnnexJson[] = [];

  for (const annexPath of files) {
    const json = await fs.readFile(annexPath, "utf-8");
    const jsonData = JSON.parse(json || "[]") as AnnexJson[];
    annexes.push(...jsonData);
  }

  return annexes;
};

export const readAllLosFromFs = async (contentFolder: string) => {
  const loFile = path.join(contentFolder, "learning-objectives.json");
  const fileBuffer = await fs.readFile(loFile, "utf-8");
  const los = JSON.parse(fileBuffer) as LearningObjectiveJson[];
  return los.sort((a, b) => a.id.localeCompare(b.id));
};

export const readAllSubjectsFromFs = async (contentFolder: string) => {
  const subjectsJson = path.join(contentFolder, "subjects.json");
  const fileBuffer = await fs.readFile(subjectsJson, "utf-8");
  const subjects = JSON.parse(fileBuffer) as SubjectJson[];
  return subjects.map((s) => ({ ...s, numberOfQuestions: 0 }));
};

export const readAllCoursesFromFs = async (contentFolder: string) => {
  const coursesJson = path.join(contentFolder, "courses.json");
  const fileBuffer = await fs.readFile(coursesJson, "utf-8");
  return JSON.parse(fileBuffer) as CourseJson[];
};

export const readAllFlashcardsFromFs = async (
  flashCardsFolder: string,
): Promise<FlashcardCollection[]> => {
  if (!exists(flashCardsFolder)) return [];
  const files = await fs.readdir(flashCardsFolder).catch(() => []);
  const flashcardFiles = files.filter((f) => f.endsWith(".json"));
  const flashcards: FlashcardCollection[] = [];
  for (const file of flashcardFiles) {
    const filePath = path.join(flashCardsFolder, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonString) as FlashcardContent[];
    flashcards.push({
      id: file.replace(".json", ""),
      flashcards: jsonData,
      title: file
        .replace(".json", "")
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join(" "),
    });
  }
  return flashcards;
};
