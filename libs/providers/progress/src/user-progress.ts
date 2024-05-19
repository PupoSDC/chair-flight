import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { getEnvVariableOrThrow } from "@cf/base/env";
import { userProgressSchema } from "../drizzle";
import { populateQuestionTemplates } from "./functions/populate-question-templates";
import type { UserProgressDb } from "../drizzle";
import type { QuestionTemplate } from "@cf/core/content";

export class UserProgress {
  private db: UserProgressDb;

  constructor() {
    const schema = userProgressSchema;
    const pgProvider = getEnvVariableOrThrow("PROVIDER_POSTGRES_USER_PROGRESS");
    const client = new Client({ connectionString: pgProvider });
    this.db = drizzle(client, { schema });
    client.connect();
  }

  async populateQuestionTemplates(questions: QuestionTemplate[]) {
    return populateQuestionTemplates(this.db, questions);
  }
}
