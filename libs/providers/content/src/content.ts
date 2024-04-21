import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { getEnvVariableOrThrow } from "@cf/base/env";
import type { BlogPost } from "@cf/core/blog";
import type { QuestionBank, QuestionBankName } from "@cf/core/question-bank";
import { contentSchema, type ContentDb } from "../drizzle";
import { updateBlog } from "./functions/update-blog";
import { updateQuestionBank } from "./functions/update-question-bank";
import { getBankMetadata } from "./functions/get-bank-metadata";

export class Content {
  private static db: ContentDb;
  private static client: Client;

  constructor() {
    const schema = contentSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_CONTENT");
    Content.client = new Client({ connectionString: pgProvider });
    Content.db = drizzle(Content.client, { schema });
    Content.client.connect();
  }

  public updateBlog = (blogPosts: BlogPost[]) =>
    updateBlog(Content.db, blogPosts);

  public updateQuestionBank = (content: QuestionBank) =>
    updateQuestionBank(Content.db, content);

  public getBankMetadata = (questionBank: QuestionBankName) =>
    getBankMetadata(Content.db, questionBank);
}
