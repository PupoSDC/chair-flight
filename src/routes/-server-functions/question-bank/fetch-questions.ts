import { createServerFn } from "@tanstack/react-start";
import { and, arrayContains, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { questions } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import {
  matchSearchWords,
  rankSearchWords,
  searchWithCorrection,
} from "./search-words";

const PAGE_SIZE = 40;

export const fetchQuestions = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      query: z.string().max(200).default(""),
      subject: z.string().default(""),
      learningObjective: z.string().default(""),
      docId: z.string().default(""),
      field: z.enum(["all", "id", "text"]).default("all"),
      offset: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const run = (query: string) =>
      getSupabaseDb()
        .select({
          id: questions.id,
          preview: questions.preview,
          learningObjectives: questions.learningObjectives,
          relatedQuestions: questions.relatedQuestions,
          externalIds: questions.externalIds,
        })
        .from(questions)
        .where(
          and(
            eq(questions.questionBank, data.questionBank),
            data.subject
              ? arrayContains(questions.subjects, [data.subject])
              : undefined,
            data.learningObjective
              ? sql`exists (
                select 1 from unnest(${questions.learningObjectives}) as lo
                where starts_with(lo, ${data.learningObjective})
              )`
              : undefined,
            data.docId ? eq(questions.docId, data.docId) : undefined,
            matchSearchWords(
              query,
              { id: questions.id, text: questions.preview },
              data.field,
            ),
          ),
        )
        .orderBy(
          desc(
            rankSearchWords(
              query,
              { id: questions.id, text: questions.preview },
              data.field,
            ),
          ),
          asc(questions.id),
        )
        .limit(PAGE_SIZE + 1)
        .offset(data.offset);
    const { rows, correctedQuery } = await searchWithCorrection(
      data.query,
      data.field,
      sql`select regexp_split_to_table(lower(preview), '[^a-z0-9]+') as w
        from chair_flight.questions where question_bank = ${data.questionBank}`,
      run,
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
