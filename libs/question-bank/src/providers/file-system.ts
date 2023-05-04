import { default as fs } from "fs";
import { default as path } from "path";
import { cwd } from "process";
import * as XLSX from "xlsx";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { UnimplementedError } from "@chair-flight/base/errors";
import { QuestionBankBaseRepository } from "./base";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import type {
  CourseName,
  LearningObjective,
  LearningObjectiveId,
  QuestionTemplate,
  QuestionTemplateJson,
} from "@chair-flight/base/types";

export class QuestionBankLocalRepository extends QuestionBankBaseRepository {
  private async getAllQuestionsFromLocalFs(
    dirPath: string = path.join(cwd(), "libs/question-bank/content/questions")
  ): Promise<QuestionTemplate[]> {
    const files = fs.readdirSync(dirPath);
    const questions: QuestionTemplate[] = [];
    for (const file of files) {
      const filePath = path.join(dirPath, file);

      if (fs.statSync(filePath).isDirectory()) {
        questions.push(...(await this.getAllQuestionsFromLocalFs(filePath)));
      } else if (path.extname(filePath) === ".json") {
        const jsonData = JSON.parse(
          fs.readFileSync(filePath, "utf-8")
        ) as QuestionTemplateJson[];
        const jsonDataWithSrcLocation = jsonData.map((q) => ({
          ...q,
          srcLocation: filePath,
        }));
        questions.push(...jsonDataWithSrcLocation);
      }
    }

    // todo reimplement this function as non blocking
    return new Promise((r) => r(questions));
  }

  async getAllQuestionTemplates() {
    if (!this.allQuestionTemplates.length) {
      this.allQuestionTemplates = await this.getAllQuestionsFromLocalFs();
    }
    return this.allQuestionTemplates;
  }

  async getAllLearningObjectives() {
    if (this.allLearningObjectives.length) return this.allLearningObjectives;
    const fileName = path.join(
      cwd(),
      "libs/question-bank/content/external/tk-syllabus.xlsx"
    );
    const questions = await this.getAllQuestionsFromLocalFs();
    const workbook = XLSX.readFile(fileName);
    const sheetNames = workbook.SheetNames;
    const learningObjectivesMap = sheetNames
      .slice(2)
      .flatMap<LearningObjective>((name) => {
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]) as Record<
          string,
          string
        >[];
        return sheet.map<LearningObjective>((row) => {
          const text =
            row["2020 syllabus text"]
              ?.replaceAll(":", ":\n- ")
              ?.replaceAll(";", ";\n- ") ?? "";
          const id =
            row["2020 syllabus reference"]
              ?.replaceAll(".00", "")
              ?.replaceAll(" 00", "")
              ?.trim() ?? "";

          return {
            id,
            courses: Object.keys(CourseNames)
              .filter((item) => row[item])
              .map((k) => CourseNames[k]),
            questions: [],
            text,
            contentId: id,
            // some sources are just 0 (?)... ignore those!
            source: row["Source / Comment"] || "",
          };
        });
      })
      .reduce<Record<LearningObjectiveId, LearningObjective>>((s, k) => {
        if (!k.contentId) return s;
        s[k.contentId] = k;
        return s;
      }, {});

    // Populate questions
    questions.forEach((q) => {
      (q.learningObjectives ?? []).forEach((lo) => {
        if (learningObjectivesMap[lo]) {
          learningObjectivesMap[lo].questions = [
            ...new Set([...learningObjectivesMap[lo].questions, q.id]),
          ];
        }
      });
    });

    const learningObjectives = Object.values(learningObjectivesMap);

    // Bubble up learning Objectives
    learningObjectives.forEach((lo) => {
      learningObjectives.forEach((lo2) => {
        if (lo2.id.startsWith(lo.id)) {
          lo.courses = [...new Set([...lo.courses, ...lo2.courses])];
        }
      });
    });

    this.allLearningObjectives = learningObjectives;
    return learningObjectives;
  }

  async writeQuestions(questions: QuestionTemplate[]) {
    const filesToSave = Object.values(questions).reduce<
      Record<string, QuestionTemplateJson[]>
    >((sum, { srcLocation, ...q }) => {
      const file = Object.values(q.learningObjectives)[0]
        .split(".")
        .slice(0, 2)
        .join(".");
      sum[file] ??= [];
      sum[file].push(q);
      return sum;
    }, {});

    const basePath = path.join(cwd(), "libs/question-bank/content/questions");
    fs.rmdirSync(path.join(basePath), { recursive: true });

    Object.entries(filesToSave).forEach(([file, questions]) => {
      const dir = file.split(".")[0];

      if (!fs.existsSync(path.join(basePath, dir))) {
        fs.mkdirSync(path.join(basePath, dir), {
          recursive: true,
        });
      }

      fs.writeFileSync(
        path.join(basePath, dir, `${file}.json`),
        JSON.stringify(questions, null, 2)
      );
    });

    this.allQuestionTemplates = questions;
  }

  async writeLearningObjectives(): Promise<void> {
    throw new UnimplementedError("We are not EASA. We don't write LOs");
  }
}

const CourseNames: Record<string, CourseName> = {
  "ATPL(A)": "ATPL_A",
  "CPL(A)": "CPL_A",
  "ATPL(H)/IR": "ATPL_H_IR",
  "ATPL(H)/VFR": "ATPL_H_VFR",
  "CPL(H)": "CPL_H",
  IR: "IR",
  "CBIR(A)": "CBIR_A",
};
