import { sql } from "drizzle-orm";
import {
  atplQuestionLearningObjectives,
  atplQuestions,
} from "../../../database";

export const countLearningObjectiveQuestions = () =>
  sql<number>`(
    select count(distinct qlo.question_id)
    from ${atplQuestionLearningObjectives} qlo
    join ${atplQuestions} q on q.id = qlo.question_id
    where q.removed_at is null
      and (
        qlo.learning_objective_id = "atpl_learning_objectives"."id"
        or (
          qlo.learning_objective_id collate "C"
            >= "atpl_learning_objectives"."id" || '.'
          and qlo.learning_objective_id collate "C"
            < "atpl_learning_objectives"."id" || '/'
        )
      )
  )`.mapWith(Number);
