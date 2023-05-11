// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { QuestionBankLocalRepository } from "@chair-flight/question-bank/providers";
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { questionSchema } from "@chair-flight/question-bank/schemas";

describe("questions", async () => {
  const repository = new QuestionBankLocalRepository();
  const allTemplates = await repository.getAllQuestionTemplates();
  const allTemplatesWithId = allTemplates.map((t) => [t.id, t]);

  describe.each(allTemplatesWithId)("%s", async (_, question) => {
    it("passes schema validation", () => {
      expect(questionSchema.parse(question)).toBeTruthy();
    });
  });
});
