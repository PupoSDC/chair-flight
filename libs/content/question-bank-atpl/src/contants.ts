import { getEnvVariableOrThrow } from "@chair-flight/base/env";

const BASE_PATH = `https://${getEnvVariableOrThrow("VERCEL_URL")}`;
const PUBLIC_DIST_PATH = "/content/question-bank-atpl";
const READ_PATH = `/public${PUBLIC_DIST_PATH}`;
const BUILD_PATH = `/apps/next-app${READ_PATH}`;
const API_PATH = `${BASE_PATH}${PUBLIC_DIST_PATH}`;

export const CONTENT_PATH = "./libs/content/question-bank-atpl/content";
export const BUILD_PATH_SUBJECTS = `${BUILD_PATH}/subjects.json`;
export const BUILD_PATH_LOS = `${BUILD_PATH}/learning-objectives.json`;
export const BUILD_PATH_QUESTIONS = `${BUILD_PATH}/questions.json`;
export const READ_PATH_SUBJECTS = `${READ_PATH}/subjects.json`;
export const READ_PATH_LOS = `${READ_PATH}/learning-objectives.json`;
export const READ_PATH_QUESTIONS = `${READ_PATH}/questions.json`;
export const API_PATH_SUBJECTS = `${API_PATH}/subjects.json`;
export const API_PATH_LOS = `${API_PATH}/learning-objectives.json`;
export const API_PATH_QUESTIONS = `${API_PATH}/questions.json`;
