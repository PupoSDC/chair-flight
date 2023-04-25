import { getQuestions } from "../src/getQuestions";
import { questionSchema } from "./question.schema";

describe("questions", async () => {
  const questions = Object.entries(await getQuestions());
  describe.each(questions)("%s", async (key, question) => {
    it("passes schema validation", () => {
      expect(questionSchema.parse(question)).toBeTruthy();
    });
  });
});
