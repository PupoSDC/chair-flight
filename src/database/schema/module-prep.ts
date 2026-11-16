import * as dz from "drizzle-orm/pg-core";
import { schema } from "./base.ts";

export const prepFlashcards = schema.table(
  "prep_flashcards",
  {
    collectionId: dz.text("collection_id").notNull(),
    id: dz.text().notNull(),
    question: dz.text().notNull(),
    answer: dz.text().notNull(),
  },
  (t) => [dz.primaryKey({ columns: [t.collectionId, t.id] })],
);
