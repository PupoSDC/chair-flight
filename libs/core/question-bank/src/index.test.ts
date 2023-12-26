import * as fs from "node:fs/promises";
import { questionBankQuestionSchema } from "@chair-flight/core/schemas";
import {
  QuestionBank737,
  QuestionBankA320,
  QuestionBankAtpl,
  QuestionBankInterview,
} from "./index";

beforeAll(async () => {
  await Promise.all([
    QuestionBank737.preloadQuestionBankForStaticRender(fs),
    QuestionBankA320.preloadQuestionBankForStaticRender(fs),
    QuestionBankAtpl.preloadQuestionBankForStaticRender(fs),
    QuestionBankInterview.preloadQuestionBankForStaticRender(fs),
  ]);
});

describe.each([
  ["QuestionBank737", QuestionBank737],
  ["QuestionBankA320", QuestionBankA320],
  ["QuestionBankAtpl", QuestionBankAtpl],
  ["QuestionBankInterview", QuestionBankInterview],
])("%s", (_, questionBank) => {
  describe("validate questions", async () => {
    const allTemplates = await questionBank.getAllQuestionTemplates();
    const allTemplatesWithId = allTemplates.map((t) => [t.id, t]);

    describe.each(allTemplatesWithId)("%s", (_, question) => {
      it("passes schema validation", () => {
        expect(questionBankQuestionSchema.parse(question)).toBeTruthy();
      });
    });

    it("has no duplicate ids", () => {
      const ids = allTemplates.map((t) => t.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      expect(duplicateIds).toEqual([]);
    });

    it("has no duplicate variant ids", () => {
      const ids = allTemplates.flatMap((t) => Object.keys(t.variants));
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      expect(duplicateIds).toEqual([]);
    });
  });
});
