import * as fs from "node:fs/promises";
import * as path from "node:path";
import { QuestionBank } from "../provider/question-bank";
import { Annex, QuestionTemplate } from "@cf/core/question-bank";

import { AnnexJson, QuestionTemplateJson } from "./json-types";
import { getAllFiles } from "./get-all-files";

export const writeQuestionTemplates = async (
  contentFolder: string,
  questions: QuestionTemplate[]
) => {
  const oldFiles = await getAllFiles(contentFolder, "questions.json");

  const newFilesMap = questions.reduce<Record<string, QuestionTemplateJson[]>>(
    (sum, question) => {
      const key = question.srcLocation;
      const value: QuestionTemplateJson = {
        id: question.id,
        relatedQuestions: question.relatedQuestions,
        externalIds: question.externalIds,
        annexes: question.annexes,
        learningObjectives: question.learningObjectives,
        explanation: question.explanation,
        variant: question.variant,
      };
      sum[key] ??= [];
      sum[key].push(value);
      return sum;
    }, {}
  )

  const newFiles = Object.entries(newFilesMap);

  await Promise.all(oldFiles.map(file => fs.rm(file)));
  await Promise.all(newFiles.map(([file, content]) => fs.writeFile(
    file, 
    JSON.stringify(content, null, 2),
  ))); 
}

export const writeAnnexes = async (
  contentFolder: string,
  annexes: Annex[]
) => {
  /**
  const newFiles = annexes.reduce<Record<string, AnnexJson[]>>(
    (sum, question) => {
      const key = question.srcLocation;
      const value: AnnexJson = {
        id: question.id,
        relatedQuestions: question.relatedQuestions,
        externalIds: question.externalIds,
        annexes: question.annexes,
        learningObjectives: question.learningObjectives,
        explanation: question.explanation,
        variant: question.variant,
      };
      sum[key] ??= [];
      sum[key].push(value);
      return sum;
    }, {}
  )
}
/** 
  await Promise.all(
    [...Object
      .entries(newFiles)
      .map(([fileName, questions]) => fs.writeFile(
        fileName,
        JSON.stringify(questions, null, 2)
      )),
    ...oldFiles
      .map((fileName) => fs.rm(fileName)),
    ]
  );
} **/
}