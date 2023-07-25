import { getAllQuestionsFromLocalFs } from "@chair-flight/question-bank/local";
import { questionSchema } from "@chair-flight/question-bank/schemas";

describe("validate questions", async () => {
  const allTemplates = await getAllQuestionsFromLocalFs();
  const allTemplatesWithId = allTemplates.map((t) => [t.id, t]);

  describe.each(allTemplatesWithId)("%s", async (_, question) => {
    it("passes schema validation", () => {
      expect(questionSchema.parse(question)).toBeTruthy();
    });
  });
});
