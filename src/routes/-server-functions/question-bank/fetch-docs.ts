import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { docs } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import {
  matchSearchWords,
  rankSearchWords,
  searchWithCorrection,
} from "./search-words";

const PAGE_SIZE = 40;

export const fetchDocs = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      query: z.string().max(200).default(""),
      subject: z.string().default(""),
      field: z.enum(["all", "id", "text"]).default("all"),
      offset: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const run = (query: string) =>
      getSupabaseDb()
        .select({
          id: docs.id,
          title: docs.title,
          subject: docs.subject,
          empty: docs.empty,
          learningObjectives: sql<string[]>`coalesce((
          select array_agg(lo.id order by lo.id)
          from chair_flight.learning_objectives lo
          where lo.question_bank = chair_flight.docs.question_bank
            and lo.doc_id = chair_flight.docs.id
        ), '{}')`,
        })
        .from(docs)
        .where(
          and(
            eq(docs.questionBank, data.questionBank),
            data.subject ? eq(docs.subject, data.subject) : undefined,
            matchSearchWords(
              query,
              { id: docs.id, text: docs.title },
              data.field,
            ),
          ),
        )
        .orderBy(
          desc(
            rankSearchWords(
              query,
              { id: docs.id, text: docs.title },
              data.field,
            ),
          ),
          asc(docs.id),
        )
        .limit(PAGE_SIZE + 1)
        .offset(data.offset);
    const { rows, correctedQuery } = await searchWithCorrection(
      data.query,
      data.field,
      sql`select regexp_split_to_table(lower(title), '[^a-z0-9]+') as w
        from chair_flight.docs where question_bank = ${data.questionBank}`,
      run,
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
