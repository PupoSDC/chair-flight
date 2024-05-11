import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as YAML from "yaml";
import { getAllFiles } from "./get-all-files";
import {
  annexJsonSchema,
  docJsonSchema,
  learningObjectiveJsonSchema,
  questionTemplateJsonSchema,
  subjectJsonSchema,
  courseJsonSchema,
  type AnnexJson,
  type CourseJson,
  type DocJson,
  type LearningObjectiveJson,
  type QuestionTemplateJson,
  type SubjectJson,
} from "./question-bank-json-schemas";
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

export const readAllDocsFromFs = async (
  contentFolder: string,
): Promise<DocJson[]> => {
  const posts = await getAllFiles(contentFolder, "page.md");
  const docs: DocJson[] = [];

  for (const fileName of posts) {
    const source = (await fs.readFile(fileName)).toString();
    const match = MATTER_REGEX.exec(source);
    if (!match) throw new Error(`Missing frontMatter for ${fileName}`);
    const data = YAML.parse(match[1]);
    const content = source.split("\n---").slice(1).join().trim();
    docs.push(
      docJsonSchema.parse({
        id: data.id,
        parentId: data.parent,
        description: data.description,
        title: data.title,
        fileName: fileName,
        content: content,
      }),
    );
  }

  return docs.sort((a, b) => a.id.localeCompare(b.id));
};

export const readAllQuestionsFromFs = async (contentFolder: string) => {
  const files = await getAllFiles(contentFolder, "questions.yaml");
  const questions: QuestionTemplateJson[] = [];

  for (const filePath of files) {
    const fileBuffer = await fs.readFile(filePath, "utf-8");
    const array = YAML.parse(fileBuffer);
    questions.push(...questionTemplateJsonSchema.array().parse(array));
  }
  return questions;
};

export const readAllAnnexesFromFs = async (
  contentFolder: string,
): Promise<AnnexJson[]> => {
  const files = await getAllFiles(contentFolder, "annexes.yaml");
  const annexes: AnnexJson[] = [];

  for (const annexPath of files) {
    const fileBuffer = await fs.readFile(annexPath, "utf-8");
    const array = YAML.parse(fileBuffer || "[]");
    annexes.push(...annexJsonSchema.array().parse(array));
  }

  return annexes;
};

export const readAllLosFromFs = async (
  contentFolder: string,
): Promise<LearningObjectiveJson[]> => {
  const file = path.join(contentFolder, "learning-objectives.yaml");
  const fileBuffer = await fs.readFile(file, "utf-8");
  const array = YAML.parse(fileBuffer);
  const los = learningObjectiveJsonSchema.array().parse(array);
  return los.sort((a, b) => a.id.localeCompare(b.id));
};

export const readAllSubjectsFromFs = async (
  contentFolder: string,
): Promise<SubjectJson[]> => {
  const subjectsJson = path.join(contentFolder, "subjects.yaml");
  const fileBuffer = await fs.readFile(subjectsJson, "utf-8");
  const array = YAML.parse(fileBuffer);
  return subjectJsonSchema.array().parse(array);
};

export const readAllCoursesFromFs = async (
  contentFolder: string,
): Promise<CourseJson[]> => {
  const coursesJson = path.join(contentFolder, "courses.yaml");
  const fileBuffer = await fs.readFile(coursesJson, "utf-8");
  const array = YAML.parse(fileBuffer);
  return courseJsonSchema.array().parse(array);
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
