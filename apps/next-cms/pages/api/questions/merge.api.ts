import fs from "fs";
import path from "path";
import { cwd } from "process";
import { apiHandler } from "@chair-flight/next/server";
import type {
  QuestionBankRepository,
  QuestionTemplate,
} from "@chair-flight/base/types";

export type MergeRequestBody = {
  q0: string;
  q1: string;
  resolution:
    | "delete_left"
    | "merge_left"
    | "skip"
    | "merge_right"
    | "delete_right";
};

export const getMerge = async (questionBank: QuestionBankRepository) => {
  const diffs = fs
    .readFileSync(
      path.join(cwd(), "./apps/next-cms/pages/api/questions/diffs.txt"),
      "utf-8"
    )
    .split("\n")
    .map((d) => d.trim().split(" "))
    .filter((d) => d.length === 3)
    .filter((d) => d[0] !== "Q8HZCOUX3L" && d[1] !== "Q8HZCOUX3L")
    .map((d) => d.join(" "));

  const questions = await questionBank.getAllQuestionTemplates();

  let q0: QuestionTemplate | undefined;
  let q1: QuestionTemplate | undefined;
  while (diffs.length) {
    const [id0, id1] = diffs.shift()?.split(" ") ?? ["", ""];
    q0 = questions.find((q) => q.id === id0);
    q1 = questions.find((q) => q.id === id1);

    if (!q0 || !q1) {
      fs.writeFileSync(
        path.join(cwd(), "./apps/next-cms/pages/api/questions/diffs.txt"),
        diffs.join("\n")
      );
      continue;
    }

    break;
  }

  return {
    q0,
    q1,
  };
};

export default apiHandler(
  {
    get: ({ questionBank }) => getMerge(questionBank),
    post: async ({ req, questionBank }) => {
      const body = req.body as MergeRequestBody;
      if (body.resolution === "skip") {
        const diffs = fs
          .readFileSync(
            path.join(cwd(), "./apps/next-cms/pages/api/questions/diffs.txt"),
            "utf-8"
          )
          .split("\n");
        diffs.shift();
        fs.writeFileSync(
          path.join(cwd(), "./apps/next-cms/pages/api/questions/diffs.txt"),
          diffs.join("\n")
        );
      }

      const questions = await questionBank.getAllQuestionTemplates();
      const q0 = questions.find((q) => q.id === body.q0);
      const q1 = questions.find((q) => q.id === body.q1);
      if (!q0 || !q1)
        throw new Error(`undefined question ${body.q0} or ${body.q1}`);

      if (body.resolution === "delete_left") {
        questions.splice(
          questions.findIndex((q) => q.id === body.q0),
          1
        );
        Object.values(q1.variants)[0].externalIds = [
          ...new Set([
            ...Object.values(q1.variants)[0].externalIds,
            ...Object.values(q0.variants).flatMap((q) => q.externalIds),
          ]),
        ];
      } else if (body.resolution === "merge_left") {
        questions.splice(
          questions.findIndex((q) => q.id === body.q0),
          1
        );
        q1.variants = {
          ...q1.variants,
          ...q0.variants,
        };
      } else if (body.resolution === "merge_right") {
        questions.splice(
          questions.findIndex((q) => q.id === body.q1),
          1
        );
        q0.variants = {
          ...q0.variants,
          ...q1.variants,
        };
      } else if (body.resolution === "delete_right") {
        questions.splice(
          questions.findIndex((q) => q.id === body.q1),
          1
        );
        Object.values(q0.variants)[0].externalIds = [
          ...new Set([
            ...Object.values(q1.variants).flatMap((q) => q.externalIds),
            ...Object.values(q0.variants)[0].externalIds,
          ]),
        ];
      }

      questionBank.writeQuestions(questions);
      return {};
    },
    put: async ({ req, questionBank }) => {
      const questionIds = req.body as string[];
      const questions = await questionBank.getAllQuestionTemplates();
      const question0 = questions.find((q) => q.id === questionIds[0]);
      if (!question0) throw new Error(`undefined question ${questionIds[0]}`);

      for (let i = 1; i < questionIds.length; i++) {
        const otherQ = questions.find((q) => q.id === questionIds[i]);
        if (!otherQ) throw new Error(`undefined question ${questionIds[i]}`);
        question0.variants = {
          ...question0.variants,
          ...otherQ.variants,
        };
        questions.splice(
          questions.findIndex((q) => q.id === questionIds[i]),
          1
        );
      }
      questionBank.writeQuestions(questions);
    },
  },
  {
    isAvailable: true,
    requiresAuthentication: false,
  }
);
