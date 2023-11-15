import { getEnvVariableOrThrow } from "@chair-flight/base/env";

const BASE_PATH = `https://${getEnvVariableOrThrow("VERCEL_URL")}`;
const PUBLIC_DIST_PATH = "/content/interview-flashcards";
const READ_PATH = `/public${PUBLIC_DIST_PATH}`;
const BUILD_PATH = `/apps/next-app${READ_PATH}`;
const API_PATH = `${BASE_PATH}${PUBLIC_DIST_PATH}`;

export const CONTENT_PATH = "./libs/content/interview-flashcards/content";
export const BUILD_PATH_FLASHCARDS = `${BUILD_PATH}/flashcards.json`;
export const READ_PATH_FLASHCARDS = `${READ_PATH}/flashcards.json`;
export const API_PATH_FLASHCARDS = `${API_PATH}/flashcards.json`;
