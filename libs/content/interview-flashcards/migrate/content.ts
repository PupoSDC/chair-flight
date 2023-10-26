import { default as fs } from "fs/promises";
import { default as path } from "path";
import { BUILD_PATH_FLASHCARDS, CONTENT_PATH } from "../src/constants";
import type { FlashCardContent } from "@chair-flight/base/types";

export const readAllFlashCardsFromFs = async (): Promise<
  Record<string, FlashCardContent[]>
> => {
  const dirPath = path.join(process.cwd(), CONTENT_PATH);
  const flashCardFiles = await fs.readdir(dirPath);
  const flashCards: Record<string, FlashCardContent[]> = {};
  for (const file of flashCardFiles) {
    const filePath = path.join(dirPath, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonString) as FlashCardContent[];
    flashCards[file.replace(".json", "")] = jsonData;
  }
  return flashCards;
};

export const buildFlashCards = async () => {
  const flashCards = await readAllFlashCardsFromFs();
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_FLASHCARDS),
    JSON.stringify(flashCards),
  );
};
