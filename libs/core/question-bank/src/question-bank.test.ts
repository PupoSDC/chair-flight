import * as fs from "node:fs/promises";
import { questionBankQuestionSchema } from "@chair-flight/core/schemas";
import { questionBanks } from "./index";

describe("QuestionBank", async () => {
  await Promise.all(
    (["b737", "a320", "atpl", "prep"] as const).map((qb) =>
      questionBanks[qb].preloadForStaticRender(fs),
    ),
  );

  const modulesWithQuestions = ["b737", "a320", "atpl"] as const;
  const allQuestions = await Promise.all(
    modulesWithQuestions
      .map((b) => questionBanks[b])
      .map((b) => b.getAll("questions")),
  ).then((qs) => qs.flat().map((q) => [q.id, q] as const));

  const questionIds = allQuestions.map(([id]) => id);
  const variantIds = allQuestions.flatMap(([, q]) => Object.keys(q.variants));

  test("QuestionBankB737 has correct config", () => {
    expect(questionBanks["b737"].getName()).toBe("b737");
    expect(questionBanks["b737"].has("questions")).toBe(true);
    expect(questionBanks["b737"].has("learningObjectives")).toBe(false);
    expect(questionBanks["b737"].has("media")).toBe(false);
    expect(questionBanks["b737"].has("flashcards")).toBe(false);
  });

  test("QuestionBankA320 has correct config", () => {
    expect(questionBanks["a320"].getName()).toBe("a320");
    expect(questionBanks["a320"].has("questions")).toBe(true);
    expect(questionBanks["a320"].has("learningObjectives")).toBe(false);
    expect(questionBanks["a320"].has("media")).toBe(false);
    expect(questionBanks["a320"].has("flashcards")).toBe(false);
  });

  test("QuestionBankAtpl has correct config", () => {
    expect(questionBanks["atpl"].getName()).toBe("atpl");
    expect(questionBanks["atpl"].has("questions")).toBe(true);
    expect(questionBanks["atpl"].has("learningObjectives")).toBe(true);
    expect(questionBanks["atpl"].has("media")).toBe(true);
    expect(questionBanks["atpl"].has("flashcards")).toBe(false);
  });

  test("QuestionBankPrep has correct config", () => {
    expect(questionBanks["prep"].getName()).toBe("prep");
    expect(questionBanks["prep"].has("questions")).toBe(false);
    expect(questionBanks["prep"].has("learningObjectives")).toBe(false);
    expect(questionBanks["prep"].has("media")).toBe(false);
    expect(questionBanks["prep"].has("flashcards")).toBe(true);
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
