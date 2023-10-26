import { getEnvVariableOrThrow } from "@chair-flight/base/env";

export const BASE_PATH = getEnvVariableOrThrow("NEXT_PUBLIC_BASE_URL");
export const CONTENT_PATH = "./libs/content/interview-flashcards/content";
export const PUBLIC_PATH = "/content/interview-flashcards";
export const BUILD_PATH = `./apps/next-app/public${PUBLIC_PATH}`;
export const BUILD_PATH_FLASHCARDS = `${BUILD_PATH}/flashcards.json`;
export const API_FLASHCARDS_PATH = `${BASE_PATH}${PUBLIC_PATH}/flashcards.json`;
