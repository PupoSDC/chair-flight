import { default as fs } from "fs/promises";
import { default as path } from "path";
import { BUILD_PATH_flashcardS, CONTENT_PATH } from "../src/constants";
import type { flashcardContent } from "@chair-flight/base/types";

export const readAllflashcardsFromFs = async (): Promise<
  Record<string, flashcardContent[]>
> => {
  const dirPath = path.join(process.cwd(), CONTENT_PATH);
  const flashcardFiles = await fs.readdir(dirPath);
  const flashcards: Record<string, flashcardContent[]> = {};
  for (const file of flashcardFiles) {
    const filePath = path.join(dirPath, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonString) as flashcardContent[];
    flashcards[file.replace(".json", "")] = jsonData;
  }
  return flashcards;
};

export const buildflashcards = async () => {
  const flashcards = await readAllflashcardsFromFs();
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_flashcardS),
    JSON.stringify(flashcards),
  );
};
