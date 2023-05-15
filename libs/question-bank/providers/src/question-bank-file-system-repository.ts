import { default as fs } from "fs";
import { default as path } from "path";
import { cwd } from "process";
import * as XLSX from "xlsx";
import { NotFoundError, UnimplementedError } from "@chair-flight/base/errors";
import type {
  CourseName,
  LearningObjective,
  LearningObjectiveId,
  LearningObjectiveSummary,
  QuestionBankRepository,
  QuestionTemplate,
  QuestionTemplateJson,
} from "@chair-flight/base/types";

export class QuestionBankLocalRepository implements QuestionBankRepository {
  private intentionallyLeftBlankPattern = /Intentionally left blank/i;
  private contentPath = "libs/question-bank/content/src";
  private courseNames: Record<string, CourseName> = {
    "ATPL(A)": "ATPL_A",
    "CPL(A)": "CPL_A",
    "ATPL(H)/IR": "ATPL_H_IR",
    "ATPL(H)/VFR": "ATPL_H_VFR",
    "CPL(H)": "CPL_H",
    IR: "IR",
    "CBIR(A)": "CBIR_A",
  };
  private allQuestionTemplates: QuestionTemplate[] = [];
  private allLearningObjectives: LearningObjective[] = [];

  private async getAllQuestionsFromLocalFs(
    dirPath: string = path.join(cwd(), this.contentPath, "questions")
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

  async getQuestionTemplate(questionId: string) {
    if (!this.allQuestionTemplates.length) {
      this.allQuestionTemplates = await this.getAllQuestionsFromLocalFs();
    }
    const question = this.allQuestionTemplates.find((q) => q.id === questionId);
    if (!question) throw new NotFoundError(`Question ${questionId} not found`);
    return question;
  }

  async getQuestionTemplates(questionIds: string[]) {
    if (!this.allQuestionTemplates.length) {
      this.allQuestionTemplates = await this.getAllQuestionsFromLocalFs();
    }
    return this.allQuestionTemplates.filter((q) => questionIds.includes(q.id));
  }

  async getAllLearningObjectives() {
    if (this.allLearningObjectives.length) return this.allLearningObjectives;
    const fileName = path.join(
      cwd(),
      this.contentPath,
      "external/tk-syllabus.xlsx"
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
          const text = (row["2020 syllabus text"] ?? "")
            .replaceAll(":", ":\n- ")
            .replaceAll(";", ";\n- ")
            .replace(/\b[A-Z]+\b/g, (match) => {
              return match.charAt(0) + match.slice(1).toLowerCase();
            })
            .split("Remark:")[0];
          const id =
            row["2020 syllabus reference"]
              ?.replaceAll(".00", "")
              ?.replaceAll(" 00", "")
              ?.trim() ?? "";

          return {
            id,
            courses: Object.keys(this.courseNames)
              .filter((item) => row[item])
              .map((k) => this.courseNames[k]),
            questions: [],
            text,
            contentId: id,
            // some sources are just 0 (?)... ignore those!
            source: row["Source / Comment"] || "",
          };
        });
      })
      .filter((lo) => !this.intentionallyLeftBlankPattern.test(lo.text))
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

  async getLearningObjective(id: string) {
    if (!this.allLearningObjectives.length) {
      this.allLearningObjectives = await this.getAllLearningObjectives();
    }
    const lo = this.allLearningObjectives.find((lo) => lo.id === id);
    if (!lo) throw new NotFoundError(`Lo ${id} not found`);
    return lo;
  }

  async getLearningObjectives(ids: string[]) {
    if (!this.allLearningObjectives.length) {
      this.allLearningObjectives = await this.getAllLearningObjectives();
    }
    return this.allLearningObjectives.filter((lo) => ids.includes(lo.id));
  }

  async getAllSubjects() {
    const allLearningObjectives = await this.getAllLearningObjectives();
    return allLearningObjectives.reduce<LearningObjectiveSummary[]>(
      (acc, lo) => {
        const path = lo.id
          .split(".")
          .map((_, index, arr) => arr.slice(0, index + 1).join("."));

        if (path.length == 1) {
          acc.push({
            id: lo.id,
            text: lo.text,
            numberOfQuestions: lo.questions.length,
            numberOfLearningObjectives: 0,
          });
          return acc;
        }

        const subject = acc.find((s) => {
          const key = path[0] === "071" ? "070" : path[0];
          return s.id === key;
        });

        if (!subject) throw new Error(`${path[0]} should be defined!`);
        subject.numberOfLearningObjectives += 1;
        subject.numberOfQuestions += lo.questions.length;

        if (path.length === 2) {
          subject.children ??= [];
          subject.children.push({
            id: lo.id,
            text: lo.text,
            numberOfQuestions: lo.questions.length,
            numberOfLearningObjectives: 0,
          });
          return acc;
        }

        const chapter = subject.children?.find((t) => t.id === path[1]);
        if (!chapter) throw new Error(`${path[1]} should be defined!`);
        chapter.numberOfLearningObjectives += 1;
        chapter.numberOfQuestions += lo.questions.length;

        if (path.length === 3) {
          chapter.children ??= [];
          chapter.children.push({
            id: lo.id,
            text: lo.text,
            numberOfQuestions: lo.questions.length,
            numberOfLearningObjectives: 0,
          });
          return acc;
        }

        const topic = chapter.children?.find((t) => t.id === path[2]);
        if (!topic) throw new Error(`${path[2]} should be defined!`);
        topic.numberOfLearningObjectives += 1;
        topic.numberOfQuestions += lo.questions.length;

        return acc;
      },
      []
    );
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

    const basePath = path.join(cwd(), this.contentPath, "questions");
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

  async writeSubjects(): Promise<void> {
    throw new UnimplementedError("We are not EASA. We don't write LOs");
  }
}
