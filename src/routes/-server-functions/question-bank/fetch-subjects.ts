import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq, gt, sql } from "drizzle-orm";
import { z } from "zod";
import { learningObjectives, subjects } from "../../../database";
import { QUESTION_BANK_NAMES } from "../../../libs/core/question-bank/question-banks";
import { getSupabaseDb } from "../../../libs/providers/supabase-db";

export const fetchSubjects = createServerFn({ method: "GET" })
  .validator(z.object({ questionBank: z.enum(QUESTION_BANK_NAMES) }))
  .handler(async ({ data }) => {
    const db = getSupabaseDb();
    const [subjectRows, chapterRows] = await Promise.all([
      db
        .select()
        .from(subjects)
        .where(eq(subjects.questionBank, data.questionBank))
        .orderBy(asc(subjects.id)),
      db
        .select({
          id: learningObjectives.id,
          subject: learningObjectives.subject,
          text: learningObjectives.text,
          numberOfQuestions: learningObjectives.numberOfQuestions,
        })
        .from(learningObjectives)
        .where(
          and(
            eq(learningObjectives.questionBank, data.questionBank),
            gt(learningObjectives.numberOfQuestions, 0),
            sql`array_length(string_to_array(${learningObjectives.id}, '.'), 1) in (2, 3)`,
          ),
        )
        .orderBy(asc(learningObjectives.id)),
    ]);
    return subjectRows.map((subject) => {
      const subjectRowsOnly = chapterRows.filter(
        (lo) => lo.subject === subject.id,
      );
      return {
        ...subject,
        chapters: subjectRowsOnly
          .filter((lo) => lo.id.split(".").length === 2)
          .map((chapter) => ({
            ...chapter,
            sections: subjectRowsOnly.filter(
              (lo) =>
                lo.id.split(".").length === 3 &&
                lo.id.startsWith(`${chapter.id}.`),
            ),
          })),
      };
    });
  });
