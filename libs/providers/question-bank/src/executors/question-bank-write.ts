import * as fs from "node:fs/promises";
import * as path from "node:path";
import { Annex, QuestionTemplate } from "@cf/core/question-bank";
import { QuestionBank } from "../provider/question-bank";
import { getAllFiles } from "./get-all-files";
import { AnnexJson, QuestionTemplateJson } from "./json-types";
import { makeMap } from "@cf/base/utils";

export const writeQuestionTemplates = async (
  contentFolder: string,
  questions: QuestionTemplate[],
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
    },
    {},
  );

  const newFiles = Object.entries(newFilesMap);

  await Promise.all(oldFiles.map((file) => fs.rm(file)));
  await Promise.all(
    newFiles.map(([file, content]) =>
      fs.writeFile(file, JSON.stringify(content, null, 2)),
    ),
  );
};

export const writeAnnexes = async (contentFolder: string, annexes: Annex[]) => {
  const oldFiles = await getAllFiles(contentFolder, "annexes.json");
  const annexesMap = makeMap(annexes, (a) => a.id);
  const newFilesMap = annexes.reduce<Record<string, AnnexJson[]>>(
    (sum, annex) => {
      const key = annex.srcLocation;
      const value: AnnexJson = {
        id: annex.id,
        description: annex.description,
        format: annex.format, 
      };
      sum[key] ??= [];
      sum[key].push(value);
      return sum;
    }, {}
  )
 
  const allImages = await getAllFiles(contentFolder, ".jpg");
  for (const oldLocation of allImages) {
    const id = oldLocation.split("/").pop()?.split(".")[0] as string;
    const annex = annexesMap[id];

    if (!annex) {
      await fs.rm(oldLocation);
      continue;
    } 

    const fileName = `annexes/${id}.${annex.format}`;
    const newLocation = annex.srcLocation.replace("annexes.json", fileName);
    
    if (newLocation === oldLocation) {
      continue;
    }

    await fs.cp(oldLocation, newLocation)
    await fs.rm(oldLocation);
  }

  const newFiles = Object.entries(newFilesMap);
  await Promise.all(oldFiles.map((file) => fs.rm(file)));
  await Promise.all(
    newFiles.map(([file, content]) =>
      fs.writeFile(file, JSON.stringify(content, null, 2)),
    ),
  );
}