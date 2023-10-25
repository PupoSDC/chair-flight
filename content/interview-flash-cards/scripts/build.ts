import { default as fs } from "fs/promises";
import { default as path } from "path";
import type { FlashCardContent } from "@chair-flight/base/types";

const CONTENT_PATH = "./content/interview-flash-cards/content";
const BUILD_PATH = "./apps/next-app/public/content/interview-flash-cards";

const getAllFlashCards = async (): Promise<
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

const buildFlashCards = async () => {
  const flashCards = await getAllFlashCards();
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH, "flash-cards.json"),
    JSON.stringify(flashCards),
  );
};

buildFlashCards();
