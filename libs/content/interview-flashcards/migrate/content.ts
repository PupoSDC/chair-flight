import { default as fs } from "fs/promises";
import { default as path } from "path";
import { BUILD_PATH_FLASHCARDS, CONTENT_PATH } from "../src/constants";
import type { FlashcardContent } from "@chair-flight/base/types";

const readAllFlashcardsFromFs = async (): Promise<
  Record<string, FlashcardContent[]>
> => {
  const dirPath = path.join(process.cwd(), CONTENT_PATH);
  const flashcardFiles = await fs.readdir(dirPath);
  const flashcards: Record<string, FlashcardContent[]> = {};
  for (const file of flashcardFiles) {
    const filePath = path.join(dirPath, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonString) as FlashcardContent[];
    flashcards[file.replace(".json", "")] = jsonData;
  }
  return flashcards;
};

export const buildFlashcards = async () => {
  const flashcards = await readAllFlashcardsFromFs();
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_FLASHCARDS),
    JSON.stringify(flashcards),
  );
};
