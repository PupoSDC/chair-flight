import { createServerFn } from "@tanstack/react-start";
import { and, asc, desc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import {
  atplLearningObjectives as learningObjectives,
  atplQuestionsToExternalIds as questionExternalIds,
  atplQuestionLearningObjectives as questionLearningObjectives,
  atplQuestions as questions,
  atplQuestionsToQuestions as relatedQuestions,
} from "../../../database";
import { matchSearchWords } from "../../../libs/core/search/match-search-words";
import { rankSearchWords } from "../../../libs/core/search/rank-search-words";
import { searchWithCorrection } from "../../../libs/core/search/search-with-correction";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

const PAGE_SIZE = 40;

export const fetchAtplQuestions = createServerFn({ method: "GET" })
  .validator(
    z.object({
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
          learningObjectives: sql<string[]>`array(
            select ${questionLearningObjectives.learningObjectiveId}
            from ${questionLearningObjectives}
            where ${questionLearningObjectives.questionId} = ${questions.id}
            order by 1
          )`,
          relatedQuestions: sql<string[]>`array(
            select ${relatedQuestions.relatedQuestionId}
            from ${relatedQuestions}
            where ${relatedQuestions.questionId} = ${questions.id}
            order by 1
          )`,
          externalIds: sql<string[]>`array(
            select ${questionExternalIds.externalId}
            from ${questionExternalIds}
            where ${questionExternalIds.questionId} = ${questions.id}
            order by 1
          )`,
        })
        .from(questions)
        .where(
          and(
            isNull(questions.removedAt),
            data.subject
              ? sql`exists (
                select 1 from ${questionLearningObjectives} qlo
                join ${learningObjectives} lo
                  on lo.id = qlo.learning_objective_id
                where qlo.question_id = ${questions.id}
                  and lo.subject = ${data.subject}
              )`
              : undefined,
            data.learningObjective
              ? sql`exists (
                select 1 from ${questionLearningObjectives} qlo
                where qlo.question_id = ${questions.id}
                  and starts_with(
                    qlo.learning_objective_id,
                    ${data.learningObjective}
                  )
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
        from ${questions}
        where removed_at is null`,
      run,
      (query) => getSupabaseDb().execute(query),
    );
    return {
      items: rows.slice(0, PAGE_SIZE),
      nextOffset: rows.length > PAGE_SIZE ? data.offset + PAGE_SIZE : null,
      correctedQuery,
    };
  });
