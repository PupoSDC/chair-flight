import { getEnvVariableOrDefault } from "@chair-flight/base/env";

export const BASE_PATH = getEnvVariableOrDefault("NEXT_PUBLIC_BASE_URL", "");
export const CONTENT_PATH = "./libs/content/question-bank-atpl/content";
export const PUBLIC_PATH = "/content/question-bank-atpl";
export const BUILD_PATH = `./apps/next-app/public${PUBLIC_PATH}`;
export const BUILD_PATH_SUBJECTS = `${BUILD_PATH}/subjects.json`;
export const BUILD_PATH_QUESTIONS = `${BUILD_PATH}/questions.json`;
export const BUILD_PATH_LEARNING_OBJECTIVES = `${BUILD_PATH}/learning-objectives.json`;
export const API_ROOT = `${BASE_PATH}${PUBLIC_PATH}`;
export const API_SUBJECTS_PATH = `${API_ROOT}/subjects.json`;
export const API_QUESTIONS_PATH = `${API_ROOT}/questions.json`;
export const API_LEARNING_OBJECTIVES_PATH = `${API_ROOT}/learning-objectives.json`;
