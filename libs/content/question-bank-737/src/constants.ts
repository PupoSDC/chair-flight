import { getEnvVariableOrDefault } from "@chair-flight/base/env";

export const BASE_PATH = getEnvVariableOrDefault("NEXT_PUBLIC_BASE_URL", "");
export const CONTENT_PATH = "./libs/content/question-bank-737/content";
export const PUBLIC_PATH = "/content/question-bank-737";
export const BUILD_PATH = `./apps/next-app/public${PUBLIC_PATH}`;
export const API_SUBJECT_PATH = `${BASE_PATH}${PUBLIC_PATH}/subject.json`;
export const API_QUESTIONS_PATH = `${BASE_PATH}${PUBLIC_PATH}/questions.json`;
