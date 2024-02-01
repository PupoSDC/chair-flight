import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parse } from "yaml";
import {
  Annex,
  Course,
  Doc,
  FlashcardCollection,
  FlashcardContent,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "../types";
import { getAllFiles } from "./get-all-files";

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
  const parsedPosts: Doc[] = [];

  for (const post of posts) {
    const source = (await fs.readFile(post)).toString();
    const match = MATTER_REGEX.exec(source);
    if (!match) throw new Error(`Missing frontMatter for ${post}`);
    const data = parse(match[1]);
    const content = source.split("\n---").slice(1).join().trim();
    parsedPosts.push({
      id: data.id,
      parent: data.id,
      title: data.id,
      subject: "",
      learningObjectives: [],
      questions: [],
      children: [],
      fileName: post,
      content: content,
      empty: !content,
    });
  }

  return parsedPosts;
};

export const readAllQuestionsFromFs = async (contentFolder: string) => {
  const files = await getAllFiles(contentFolder, "questions.json");
  const questions: QuestionTemplate[] = [];

  for (const filePath of files) {
    const json = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(json) as QuestionTemplate[];
    const jsonDataWithSrcLocation = jsonData.map((q) => ({
      ...q,
      docId: "",
      subject: "",
      srcLocation: filePath.replace(process.cwd(), ""),
    }));

    questions.push(...jsonDataWithSrcLocation);
  }

  return questions;
};

export const readAllAnnexesFromFs = async (contentFolder: string) => {
  const files = await getAllFiles(contentFolder, "annexes.json");
  const annexes : Annex[] = [];

  for (const annexPath of files) {
    console.log(annexPath)
    const json = await fs.readFile(annexPath, "utf-8");
    const jsonData = JSON.parse(json || "[]") as Annex[];
    const annexData = jsonData.map((a) => ({
      ...a,
      doc: "",
      questions: [],
      subjects: [],
      learningObjectives: [],
    }));

    annexes.push(...annexData);
  }

  return annexes;
};

export const readAllLosFromFs = async (losJson: string) => {
  const fileBuffer = await fs.readFile(losJson, "utf-8");
  const los = JSON.parse(fileBuffer) as LearningObjective[];
  return los.map((s) => ({ ...s, questions: [], nestedQuestions: [] }));
};

export const readAllSubjectsFromFs = async (subjectsJson: string) => {
  const fileBuffer = await fs.readFile(subjectsJson, "utf-8");
  const subjects = JSON.parse(fileBuffer) as Subject[];
  return subjects.map((s) => ({ ...s, numberOfQuestions: 0 }));
};

export const readAllCoursesFromFs = async (coursesJson: string) => {
  const fileBuffer = await fs.readFile(coursesJson, "utf-8");
  return JSON.parse(fileBuffer) as Course[];
};

export const readAllFlashcardsFromFs = async (
  flashCardsFolder: string,
): Promise<FlashcardCollection[]> => {
  if (!exists(flashCardsFolder)) return [];
  const files = await fs.readdir(flashCardsFolder);
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
