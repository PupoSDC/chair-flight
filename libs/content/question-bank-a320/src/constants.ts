import { getUrlPathOnServer } from "@chair-flight/base/env";

const PUBLIC_DIST_PATH = "/content/question-bank-a320";
const READ_PATH = `/public${PUBLIC_DIST_PATH}`;
const BUILD_PATH = `/apps/next-app${READ_PATH}`;
const API_PATH = `${getUrlPathOnServer()}${PUBLIC_DIST_PATH}`;

export const CONTENT_PATH = "./libs/content/question-bank-a320/content";
export const BUILD_PATH_SUBJECT = `${BUILD_PATH}/subject.json`;
export const BUILD_PATH_QUESTIONS = `${BUILD_PATH}/questions.json`;
export const READ_PATH_SUBJECT = `${READ_PATH}/subject.json`;
export const READ_PATH_QUESTIONS = `${READ_PATH}/questions.json`;
export const API_PATH_SUBJECT = `${API_PATH}/subject.json`;
export const API_PATH_QUESTIONS = `${API_PATH}/questions.json`;
