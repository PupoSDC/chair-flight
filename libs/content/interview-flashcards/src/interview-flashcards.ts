import { getEnvVariableOrDefault } from "@chair-flight/base/env";
import { API_PATH_FLASHCARDS, READ_PATH_FLASHCARDS } from "./constants";
import type { FlashcardContent } from "@chair-flight/base/types";

let flashcards: Record<string, FlashcardContent[]>;

export const getFlashcards = async () => {
  if (!flashcards) {
    const response = await fetch(API_PATH_FLASHCARDS);
    flashcards = (await response.json()) as Record<string, FlashcardContent[]>;
  }
  return flashcards;
};

/** Note: Do not use this outside NEXT.JS build time. */
export const preloadInterviewFlashcardsForStaticRender = async ({
  readFile,
}: {
  readFile: (path: string, string: "utf-8") => Promise<string>;
}) => {
  const stage = getEnvVariableOrDefault("NEXT_PHASE", "N/A");
  const doNotUseMessage = "Do not use this method outside NEXT.JS build time.";
  if (stage !== "phase-production-build") throw new Error(doNotUseMessage);
  const path = `${process.cwd()}${READ_PATH_FLASHCARDS}`;
  const file = JSON.parse(await readFile(path, "utf-8"));
  flashcards = file as Record<string, FlashcardContent[]>;
};
