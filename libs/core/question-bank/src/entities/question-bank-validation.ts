import { z } from "zod";
import { makeMap } from "@chair-flight/base/utils";
import { annexSchema } from "./question-bank-annex";
import { courseSchema } from "./question-bank-course";
import { docSchema } from "./question-bank-doc";
import { LearningObjectiveSchema } from "./question-bank-learning-objectives";
import { questionTemplateSchema } from "./question-bank-question";
import { subjectSchema } from "./question-bank-subject";

export const questionBankValidation = z
  .object({
    questionTemplates: z.array(questionTemplateSchema),
    docs: z.array(docSchema),
    annexes: z.array(annexSchema),
    learningObjectives: z.array(LearningObjectiveSchema),
    subjects: z.array(subjectSchema),
    courses: z.array(courseSchema),
  })
  .superRefine((val, ctx) => {
    const questionIds = makeMap(
      val.questionTemplates,
      (q) => q.id,
      () => true,
    );
    const docIds = makeMap(
      val.docs,
      (d) => d.id,
      () => true,
    );
    const annexIds = makeMap(
      val.annexes,
      (a) => a.id,
      () => true,
    );
    const loIds = makeMap(
      val.learningObjectives,
      (l) => l.id,
      () => true,
    );
    const subjectIds = makeMap(
      val.subjects,
      (s) => s.id,
      () => true,
    );
    const courseIds = makeMap(
      val.courses,
      (c) => c.id,
      () => true,
    );

    val.questionTemplates.forEach((qt) => {
      qt.relatedQuestions.forEach((q) => {
        if (questionIds[q]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Question ${q} does not exist`,
          path: ["questionTemplates", qt.id, "relatedQuestions"],
        });
      });

      qt.learningObjectives.forEach((lo) => {
        if (!loIds[lo]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Learning Objective ${lo} does not exist`,
            path: ["questionTemplates", qt.id, "learningObjectives"],
          });
        }
      });

      qt.subjects.forEach((s) => {
        if (subjectIds[s]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Subject ${s} does not exist`,
          path: ["questionTemplates", qt.id, "subjects"],
        });
      });

      qt.annexes.forEach((a) => {
        if (annexIds[a]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Annex ${a} does not exist`,
          path: ["questionTemplates", qt.id, "annexes"],
        });
      });
    });

    val.docs.forEach((d) => {
      d.questions.forEach((q) => {
        if (questionIds[q]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Question ${q} does not exist`,
          path: ["docs", d.id, "questions"],
        });
      });

      d.children.forEach((c) => {
        if (docIds[c]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Child Doc ${c} does not exist`,
          path: ["docs", d.id, "children"],
        });
      });

      if (d.parentId && !docIds[d.parentId]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Parent Doc ${d.parentId} does not exist`,
          path: ["docs", d.id, "parentId"],
        });
      }

      if (!subjectIds[d.subject] && d.subject !== "root") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Subject ${d.subject} does not exist`,
          path: ["docs", d.id, "subject"],
        });
      }
    });

    val.annexes.forEach((a) => {
      a.questions.forEach((q) => {
        if (questionIds[q]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Question ${q} does not exist`,
          path: ["annexes", a.id, "questions"],
        });
      });

      a.subjects.forEach((s) => {
        if (subjectIds[s]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Subject ${s} does not exist`,
          path: ["annexes", a.id, "subjects"],
        });
      });

      a.learningObjectives.forEach((lo) => {
        if (loIds[lo]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Learning Objective ${lo} does not exist`,
          path: ["annexes", a.id, "learningObjectives"],
        });
      });

      if (!docIds[a.doc] && a.doc !== "root") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Doc ${a.doc} does not exist`,
          path: ["annexes", a.id, "doc"],
        });
      }
    });

    val.learningObjectives.forEach((lo) => {
      lo.courses.forEach((c) => {
        if (courseIds[c]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Course ${c} does not exist`,
          path: ["learningObjectives", lo.id, "courses"],
        });
      });

      lo.learningObjectives.forEach((lo) => {
        if (loIds[lo]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Learning Objective ${lo} does not exist`,
          path: ["learningObjectives", lo, "learningObjectives"],
        });
      });

      lo.questions.forEach((q) => {
        if (questionIds[q]) return;
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Question ${q} does not exist`,
          path: ["learningObjectives", lo.id, "questions"],
        });
      });
    });
  });
