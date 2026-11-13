import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, eq } from "drizzle-orm";
import { z } from "zod";
import { docs, learningObjectives, questions } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchDoc = createServerFn({ method: "GET" })
  .validator(
    z.object({
      questionBank: z.enum(QUESTION_BANK_NAMES),
      docId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const inBank = eq(docs.questionBank, data.questionBank);
    const [doc] = await db
      .select()
      .from(docs)
      .where(and(inBank, eq(docs.id, data.docId)));
    if (!doc) throw notFound();
    const [parents, children, learningObjectiveRows, [questionCount]] =
      await Promise.all([
        db
          .select({ id: docs.id, title: docs.title })
          .from(docs)
          .where(and(inBank, eq(docs.id, doc.parentId ?? ""))),
        db
          .select({ id: docs.id, title: docs.title, empty: docs.empty })
          .from(docs)
          .where(and(inBank, eq(docs.parentId, doc.id)))
          .orderBy(asc(docs.id)),
        db
          .select({
            id: learningObjectives.id,
            text: learningObjectives.text,
            numberOfQuestions: learningObjectives.numberOfQuestions,
          })
          .from(learningObjectives)
          .where(
            and(
              eq(learningObjectives.questionBank, data.questionBank),
              eq(learningObjectives.docId, doc.id),
            ),
          )
          .orderBy(asc(learningObjectives.id)),
        db
          .select({ total: count() })
          .from(questions)
          .where(
            and(
              eq(questions.questionBank, data.questionBank),
              eq(questions.docId, doc.id),
            ),
          ),
      ]);
    return {
      ...doc,
      parent: parents.at(0) ?? null,
      children,
      learningObjectives: learningObjectiveRows,
      numberOfQuestions: questionCount.total,
    };
  });
