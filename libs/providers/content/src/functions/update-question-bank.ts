import type { QuestionBank } from "@cf/core/question-bank";
import type { ContentDb, ContentSchema} from "../../drizzle";
import { contentSchema } from "../../drizzle";
import { makeDocument } from "./make-document";

export const updateQuestionBank = async (
  db: ContentDb,
  content: QuestionBank,
) => {
  for (const [key, data] of Object.entries(content)) {
    const docs = await Promise.all(data.map(makeDocument));
    const schema = contentSchema[key as keyof ContentSchema];
    if (!schema) throw new Error(`${key} is not a valid QB entity`);
    if (!docs.length) continue;
    const castSchema = schema as ContentSchema["annexes"];
    await db.insert(castSchema).values(docs).onConflictDoNothing();
  }
};
