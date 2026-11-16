import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import {
  atplDocs as docs,
  atplLearningObjectives as learningObjectives,
  atplQuestions as questions,
} from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";
import { countLearningObjectiveQuestions } from "../atpl-learning-objectives/count-learning-objective-questions";

export const fetchAtplDoc = createServerFn({ method: "GET" })
  .validator(
    z.object({
      docId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [doc] = await db.select().from(docs).where(eq(docs.id, data.docId));
    if (!doc) throw notFound();
    const [parents, children, learningObjectiveRows, [questionCount]] =
      await Promise.all([
        db
          .select({ id: docs.id, title: docs.title })
          .from(docs)
          .where(eq(docs.id, doc.parentId ?? "")),
        db
          .select({ id: docs.id, title: docs.title, empty: docs.empty })
          .from(docs)
          .where(eq(docs.parentId, doc.id))
          .orderBy(asc(docs.id)),
        db
          .select({
            id: learningObjectives.id,
            text: learningObjectives.text,
            numberOfQuestions: countLearningObjectiveQuestions(),
          })
          .from(learningObjectives)
          .where(
            and(
              eq(learningObjectives.docId, doc.id),
              eq(learningObjectives.removed, false),
            ),
          )
          .orderBy(asc(learningObjectives.id)),
        db
          .select({ total: count() })
          .from(questions)
          .where(and(eq(questions.docId, doc.id), isNull(questions.removedAt))),
      ]);
    return {
      ...doc,
      parent: parents.at(0) ?? null,
      children,
      learningObjectives: learningObjectiveRows,
      numberOfQuestions: questionCount.total,
    };
  });
