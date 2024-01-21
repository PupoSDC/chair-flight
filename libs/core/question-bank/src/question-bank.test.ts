import * as fs from "node:fs/promises";
import { questionBankQuestionSchema } from "@chair-flight/core/schemas";
import { questionBanks } from "./index";
import type { QuestionBankName } from "@chair-flight/base/types";

describe("QuestionBank", async () => {
  await Promise.all(
    (["type", "atpl", "prep"] as const).map((qb) =>
      questionBanks[qb].preloadForStaticRender(fs),
    ),
  );

  const modulesWithQuestions = [
    "type",
    "prep",
    "atpl",
  ] satisfies QuestionBankName[];
  const allQuestions = await Promise.all(
    modulesWithQuestions
      .map((b) => questionBanks[b])
      .map((b) => b.getAll("questions")),
  ).then((qs) => qs.flat().map((q) => [q.id, q] as const));

  const questionIds = allQuestions.map(([id]) => id);
  const variantIds = allQuestions.flatMap(([, q]) => Object.keys(q.variants));

  test("QuestionBankType has correct config", async () => {
    expect(questionBanks["type"].getName()).toBe("type");
    expect(await questionBanks["type"].has("questions")).toBe(true);
    expect(await questionBanks["type"].has("courses")).toBe(true);
    expect(await questionBanks["type"].has("learningObjectives")).toBe(true);
    expect(await questionBanks["type"].has("media")).toBe(false);
    expect(await questionBanks["type"].has("flashcards")).toBe(false);
  });

  test("QuestionBankAtpl has correct config", async () => {
    expect(questionBanks["atpl"].getName()).toBe("atpl");
    expect(await questionBanks["atpl"].has("questions")).toBe(true);
    expect(await questionBanks["atpl"].has("courses")).toBe(true);
    expect(await questionBanks["atpl"].has("learningObjectives")).toBe(true);
    expect(await questionBanks["atpl"].has("media")).toBe(true);
    expect(await questionBanks["atpl"].has("flashcards")).toBe(false);
  });

  test("QuestionBankPrep has correct config", async () => {
    expect(questionBanks["prep"].getName()).toBe("prep");
    expect(await questionBanks["prep"].has("questions")).toBe(false);
    expect(await questionBanks["prep"].has("courses")).toBe(false);
    expect(await questionBanks["prep"].has("learningObjectives")).toBe(false);
    expect(await questionBanks["prep"].has("media")).toBe(false);
    expect(await questionBanks["prep"].has("flashcards")).toBe(true);
  });

  test("Questions have no duplicate ids", () => {
    expect(questionIds).toHaveLength(new Set(questionIds).size);
  });

  test("Variants have no duplicate ids", () => {
    expect(variantIds).toHaveLength(new Set(variantIds).size);
  });

  test("Questions are valid", () => {
    allQuestions.forEach(([, question]) =>
      expect
        .soft(questionBankQuestionSchema.safeParse(question))
        .toStrictEqual({ success: true, data: question }),
    );
  });
});
