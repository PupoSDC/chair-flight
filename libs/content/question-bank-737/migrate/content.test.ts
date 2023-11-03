import { questionSchema } from "@chair-flight/core/schemas";
import { readAllQuestionsFromFs } from "./content";

describe("validate questions", async () => {
  const allTemplates = await readAllQuestionsFromFs();
  const allTemplatesWithId = allTemplates.map((t) => [t.id, t]);

  describe.each(allTemplatesWithId)("%s", async (_, question) => {
    it("passes schema validation", () => {
      expect(questionSchema.parse(question)).toBeTruthy();
      console.log(questionSchema.parse(question));
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
