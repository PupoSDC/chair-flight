import { createServerFn } from "@tanstack/react-start";
import { and, count, eq, isNull, sql } from "drizzle-orm";
import {
  atplDocs as docs,
  atplLearningObjectives as learningObjectives,
  atplQuestionLearningObjectives as questionLearningObjectives,
  atplQuestions as questions,
} from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchAtplModuleStats = createServerFn({ method: "GET" }).handler(
  async () => {
    const db = getSupabaseDb();
    const total = async (
      query: Promise<{ total: number }[]>,
    ): Promise<number> => (await query)[0]?.total ?? 0;
    const [numberOfQuestions, numberOfLearningObjectives, numberOfDocs] =
      await Promise.all([
        total(
          db
            .select({ total: count() })
            .from(questions)
            .where(isNull(questions.removedAt)),
        ),
        total(
          db
            .select({ total: count() })
            .from(learningObjectives)
            .where(
              and(
                eq(learningObjectives.removed, false),
                sql`${learningObjectives.id} in (
                  select array_to_string(
                    (string_to_array(linked.id, '.'))[1:depth],
                    '.'
                  )
                  from (
                    select distinct qlo.learning_objective_id as id
                    from ${questionLearningObjectives} qlo
                    join ${questions} q on q.id = qlo.question_id
                    where q.removed_at is null
                  ) linked,
                  generate_series(
                    1,
                    cardinality(string_to_array(linked.id, '.'))
                  ) depth
                )`,
              ),
            ),
        ),
        total(db.select({ total: count() }).from(docs)),
      ]);
    return {
      questions: numberOfQuestions,
      learningObjectives: numberOfLearningObjectives,
      docs: numberOfDocs,
    };
  },
);
