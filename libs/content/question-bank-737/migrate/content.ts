import { default as fs } from "fs/promises";
import { default as path } from "path";
import {
  CONTENT_PATH,
  BUILD_PATH_QUESTIONS,
  BUILD_PATH_SUBJECT,
} from "../src/constants";
import type {
  QuestionBankQuestionTemplate,
  QuestionBankQuestionTemplateJson,
  Subject,
  SubjectJson,
} from "@chair-flight/base/types";

export const readAllQuestionsFromFs = async (): Promise<
  QuestionBankQuestionTemplate[]
> => {
  const dirPath = path.join(process.cwd(), CONTENT_PATH);
  const files = await fs.readdir(dirPath);
  const questionFiles = files.filter((f) => f.startsWith("737"));
  const questions: QuestionBankQuestionTemplate[] = [];
  for (const file of questionFiles) {
    const filePath = path.join(dirPath, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(
      jsonString,
    ) as QuestionBankQuestionTemplateJson[];
    const jsonDataWithSrcLocation = jsonData.map((q) => ({
      ...q,
      srcLocation: filePath.replace(process.cwd(), ""),
    }));
    questions.push(...jsonDataWithSrcLocation);
  }
  return questions;
};

export const readSubjectFromFs = async (): Promise<Subject> => {
  const filePath = path.join(process.cwd(), CONTENT_PATH, "subjects.json");
  const jsonString = await fs.readFile(filePath, "utf-8");
  const jsonData = JSON.parse(jsonString) as SubjectJson;
  const allQuestions = await readAllQuestionsFromFs();

  return {
    ...jsonData,
    numberOfQuestions: allQuestions.length,
    numberOfLearningObjectives: jsonData.children?.length ?? 0,
    children: jsonData.children?.map(({ children, ...child }) => ({
      ...child,
      numberOfLearningObjectives: 0,
      numberOfQuestions: allQuestions.filter((question) =>
        question.learningObjectives.includes(child.id),
      ).length,
    })),
  };
};

export const buildQuestionBank = async () => {
  const questions = await readAllQuestionsFromFs();
  const subject = await readSubjectFromFs();

  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_QUESTIONS),
    JSON.stringify(questions),
  );
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH_SUBJECT),
    JSON.stringify(subject),
  );
};
