import { userProgressSchema, type UserProgressDb } from "../../drizzle";
import type { QuestionTemplate } from "@cf/core/question-bank";

export const populateQuestionTemplates = async (
  db: UserProgressDb,
  questions: QuestionTemplate[],
) => {
  db.insert(userProgressSchema.questionTemplate)
    .values(
      questions.map((question) => ({
        id: question.id,
        lastDayReview: false,
        rating: 5,
        timesSeenInExam: 0,
      })),
    )
    .onConflictDoUpdate({
      target: userProgressSchema.questionTemplate.id,
      set: {
        lastDayReview: false,
        rating: 5,
        timesSeenInExam: 0,
      },
    })
    .execute();
};
