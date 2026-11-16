import { createServerFn } from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";
import { sql } from "drizzle-orm";
import {
  atplLearningObjectives,
  atplQuestionLearningObjectives,
  atplQuestions,
} from "../../../database";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchLearningObjectiveQuestionCounts = createServerFn({
  method: "GET",
}).handler(async () => {
  const rows = await getSupabaseDb().execute<{
    id: string;
    total: number;
  }>(sql`
    select ancestor.id, count(distinct ancestor.question_id)::int as total
    from (
      select
        qlo.question_id,
        array_to_string(
          (string_to_array(qlo.learning_objective_id, '.'))[1:depth],
          '.'
        ) as id
      from ${atplQuestionLearningObjectives} qlo
      join ${atplQuestions} q on q.id = qlo.question_id and q.removed_at is null
      cross join lateral generate_series(
        1,
        cardinality(string_to_array(qlo.learning_objective_id, '.'))
      ) depth
    ) ancestor
    join ${atplLearningObjectives} lo
      on lo.id = ancestor.id and lo.removed = false
    group by ancestor.id
  `);
  setResponseHeader(
    "Cache-Control",
    "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
  );
  return Object.fromEntries(rows.map((row) => [row.id, row.total]));
});
