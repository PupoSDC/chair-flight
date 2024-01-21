import * as XLSX from "xlsx";
import type {
  LearningObjectiveId,
  QuestionBankLearningObjectiveJson,
} from "@chair-flight/base/types";

const courseNames: Record<string, string> = {
  "ATPL(A)": "ATPL_A",
  "CPL(A)": "CPL_A",
  "ATPL(H)/IR": "ATPL_H_IR",
  "ATPL(H)/VFR": "ATPL_H_VFR",
  "CPL(H)": "CPL_H",
  IR: "IR",
  "CBIR(A)": "CBIR_A",
};

const intentionallyLeftBlankPattern = /Intentionally left blank/i;

export const parseLearningObjectivesXlsx = async ({
  xlsxPath,
}: {
  xlsxPath: string;
}): Promise<QuestionBankLearningObjectiveJson[]> => {
  const workbook = XLSX.readFile(xlsxPath);
  const sheetNames = workbook.SheetNames;
  const learningObjectives = sheetNames
    .slice(2)
    .flatMap<QuestionBankLearningObjectiveJson>((name) => {
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[name]) as Record<
        string,
        string
      >[];
      return sheet.map<QuestionBankLearningObjectiveJson>((row) => {
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
          courses: Object.keys(courseNames)
            .filter((item) => row[item])
            .map((k) => courseNames[k]),
          questions: [],
          text,
          learningObjectives: [],
          // some sources are just 0 (?)... ignore those!
          source: row["Source / Comment"] || "",
        };
      });
    })
    .filter((lo) => {
      if (intentionallyLeftBlankPattern.test(lo.text)) return false;
      if (lo.id === "") return false;
      if (lo.id.split(".").length === 1) return false;
      return true;
    });

  const learningObjectivesMap = learningObjectives.reduce(
    (sum, lo) => {
      sum[lo.id] = lo;
      return sum;
    },
    {} as Record<LearningObjectiveId, QuestionBankLearningObjectiveJson>,
  );

  // link learning objectives to one another:
  learningObjectives.forEach((lo) => {
    const parentId = lo.id.split(".").slice(0, -1).join(".");
    const parent = learningObjectivesMap[parentId];
    if (parent) parent.learningObjectives.push(lo.id);
  });

  return learningObjectives;
};
