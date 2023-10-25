import { default as fs } from "fs/promises";
import { default as path } from "path";
import type {
  QuestionTemplate,
  QuestionTemplateJson,
  Subject,
  SubjectJson,
} from "@chair-flight/base/types";

const CONTENT_PATH = "./content/question-bank-737/content";
const BUILD_PATH = "./apps/next-app/public/content/question-bank/737";

const getAllQuestions = async (): Promise<QuestionTemplate[]> => {
  const dirPath = path.join(process.cwd(), CONTENT_PATH);
  const files = await fs.readdir(dirPath);
  const questionFiles = files.filter((f) => f.startsWith("737"));
  const questions: QuestionTemplate[] = [];
  for (const file of questionFiles) {
    const filePath = path.join(dirPath, file);
    const jsonString = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(jsonString) as QuestionTemplateJson[];
    const jsonDataWithSrcLocation = jsonData.map((q) => ({
      ...q,
      srcLocation: filePath.replace(process.cwd(), ""),
    }));
    questions.push(...jsonDataWithSrcLocation);
  }
  return questions;
};

const getSubject = async (): Promise<Subject> => {
  const filePath = path.join(process.cwd(), CONTENT_PATH, "subjects.json");
  const jsonString = await fs.readFile(filePath, "utf-8");
  const jsonData = JSON.parse(jsonString) as SubjectJson;
  const allQuestions = await getAllQuestions();

  return {
    ...jsonData,
    numberOfQuestions: allQuestions.length,
    numberOfLearningObjectives: jsonData.children?.length ?? 0,
    children: jsonData.children?.map(({ children, ...child }) => ({
      ...child,
      numberOfLearningObjectives: 0,
      numberOfQuestions: allQuestions.filter((question) =>
        question.id.includes(child.id),
      ).length,
    })),
  };
};

const buildQuestionBank = async () => {
  const questions = await getAllQuestions();
  const subject = await getSubject();

  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH, "questions.json"),
    JSON.stringify(questions),
  );
  await fs.writeFile(
    path.join(process.cwd(), BUILD_PATH, "subject.json"),
    JSON.stringify(subject),
  );
};

buildQuestionBank();
