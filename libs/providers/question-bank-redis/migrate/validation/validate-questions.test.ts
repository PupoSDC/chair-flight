import { questionSchema } from "@chair-flight/core/schemas";
import { getAllQuestionsFromLocalFs } from "@chair-flight/providers/question-bank-local";

describe("validate questions", async () => {
  const allTemplates = await getAllQuestionsFromLocalFs();
  const allTemplatesWithId = allTemplates.map((t) => [t.id, t]);

  describe.each(allTemplatesWithId)("%s", async (_, question) => {
    it("passes schema validation", () => {
      expect(questionSchema.parse(question)).toBeTruthy();
    });
  });
});
