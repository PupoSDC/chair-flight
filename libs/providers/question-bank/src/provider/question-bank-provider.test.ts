import * as fs from "node:fs/promises";
import { questionBankQuestionSchema } from "@chair-flight/core/question-bank";
import { QuestionBank } from "./question-bank-provider";
import type { QuestionBankName } from "@chair-flight/core/question-bank";

const questionBanks: Record<QuestionBankName, QuestionBank> = {
  type: new QuestionBank("type"),
  atpl: new QuestionBank("atpl"),
  prep: new QuestionBank("prep"),
};

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
  const variantIds2 = allQuestions.flatMap(([, q]) =>
    Object.values(q.variants).map((v) => v.id),
  );

  test("QuestionBankType has correct config", async () => {
    expect(questionBanks["type"].getName()).toBe("type");
    expect(await questionBanks["type"].has("questions")).toBe(true);
    expect(await questionBanks["type"].has("courses")).toBe(true);
    expect(await questionBanks["type"].has("learningObjectives")).toBe(true);
    expect(await questionBanks["type"].has("annexes")).toBe(false);
    expect(await questionBanks["type"].has("flashcards")).toBe(false);
  });

  test("QuestionBankAtpl has correct config", async () => {
    expect(questionBanks["atpl"].getName()).toBe("atpl");
    expect(await questionBanks["atpl"].has("questions")).toBe(true);
    expect(await questionBanks["atpl"].has("courses")).toBe(true);
    expect(await questionBanks["atpl"].has("learningObjectives")).toBe(true);
    expect(await questionBanks["atpl"].has("annexes")).toBe(true);
    expect(await questionBanks["atpl"].has("flashcards")).toBe(false);
  });

  test("QuestionBankPrep has correct config", async () => {
    expect(questionBanks["prep"].getName()).toBe("prep");
    expect(await questionBanks["prep"].has("questions")).toBe(false);
    expect(await questionBanks["prep"].has("courses")).toBe(false);
    expect(await questionBanks["prep"].has("learningObjectives")).toBe(false);
    expect(await questionBanks["prep"].has("annexes")).toBe(false);
    expect(await questionBanks["prep"].has("flashcards")).toBe(true);
  });

  test("Questions have no duplicate ids", () => {
    expect(questionIds).toHaveLength(new Set(questionIds).size);
  });

  test("Variants have no duplicate ids", () => {
    expect(variantIds).toHaveLength(new Set(variantIds).size);
  });

  test("Variant Ids match the ids on the variant map", () => {
    variantIds.forEach((vId, i) =>
      expect.soft(vId).toStrictEqual(variantIds2[i]),
    );
  });

  test("Questions are valid", () => {
    allQuestions.forEach(([, question]) =>
      expect
        .soft(questionBankQuestionSchema.safeParse(question))
        .toStrictEqual({ success: true, data: question }),
    );
  });
});
