import { createServerFn } from "@tanstack/react-start";
import { and, arrayContains, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { learningObjectives } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import {
  matchSearchWords,
  rankSearchWords,
  searchWithCorrection,
} from "./search-words";

const PAGE_SIZE = 40;

export const fetchLearningObjectives = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      query: z.string().max(200).default(""),
      subject: z.string().default(""),
      parentId: z.string().default(""),
      course: z.string().default(""),
      field: z.enum(["all", "id", "text"]).default("all"),
      offset: z.number().int().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const run = (query: string) =>
      getSupabaseDb()
        .select({
          id: learningObjectives.id,
          text: learningObjectives.text,
          courses: learningObjectives.courses,
          source: learningObjectives.source,
          numberOfQuestions: learningObjectives.numberOfQuestions,
        })
        .from(learningObjectives)
        .where(
          and(
            eq(learningObjectives.questionBank, data.questionBank),
            data.subject
              ? eq(learningObjectives.subject, data.subject)
              : undefined,
            data.course
              ? arrayContains(learningObjectives.courses, [data.course])
              : undefined,
            data.parentId
              ? eq(learningObjectives.parentId, data.parentId)
              : undefined,
            matchSearchWords(
              query,
              { id: learningObjectives.id, text: learningObjectives.text },
              data.field,
            ),
          ),
        )
        .orderBy(
          desc(
            rankSearchWords(
              query,
              { id: learningObjectives.id, text: learningObjectives.text },
              data.field,
            ),
          ),
          asc(learningObjectives.id),
        )
        .limit(PAGE_SIZE + 1)
        .offset(data.offset);
    const { rows, correctedQuery } = await searchWithCorrection(
      data.query,
      data.field,
      sql`select regexp_split_to_table(lower(text), '[^a-z0-9]+') as w
        from chair_flight.learning_objectives where question_bank = ${data.questionBank}`,
      run,
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
