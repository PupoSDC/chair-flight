import { and, eq, inArray } from "drizzle-orm";
import { takeOneOrThrow } from "@cf/base/utils";
import {
  annexSchema,
  courseSchema,
  docSchema,
  learningObjectiveSchema,
  questionTemplateSchema,
  subjectSchema,
} from "@cf/core/question-bank";
import { contentSchema } from "../../drizzle";
import { Content } from "./content";
import type {
  Annex,
  Course,
  Doc,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/question-bank";

type ResourceToType = {
  questions: QuestionTemplate;
  learningObjectives: LearningObjective;
  annexes: Annex;
  subjects: Subject;
  courses: Course;
  docs: Doc;
  // flashcards: FlashcardCollection;
};

type Resource =
  | "questions"
  | "learningObjectives"
  | "annexes"
  | "subjects"
  | "courses"
  | "docs";
// | "flashcards"

export class QuestionBank extends Content {
  private static caches = {
    questions: {} as Record<string, QuestionTemplate>,
    learningObjectives: {} as Record<string, LearningObjective>,
    annexes: {} as Record<string, Annex>,
    subjects: {} as Record<string, Subject>,
    courses: {} as Record<string, Course>,
    docs: {} as Record<string, Doc>,
  };

  private resourceToZodSchema = {
    questions: questionTemplateSchema,
    learningObjectives: learningObjectiveSchema,
    annexes: annexSchema,
    subjects: subjectSchema,
    courses: courseSchema,
    docs: docSchema,
    // flashcards: flashcardSchema,
  };

  private resourceToTable = {
    questions: contentSchema.questionTemplates,
    learningObjectives: contentSchema.learningObjectives,
    annexes: contentSchema.annexes,
    subjects: contentSchema.subjects,
    courses: contentSchema.courses,
    docs: contentSchema.docs,
    // flashcards: contentSchema.flashcards,
  };

  private resourceToDrizzleSchema = {
    questions: contentSchema.questionTemplates,
    learningObjectives: contentSchema.learningObjectives,
    annexes: contentSchema.annexes,
    subjects: contentSchema.subjects,
    courses: contentSchema.courses,
    docs: contentSchema.docs,
    // flashcards: flashcardSchema,
  };

  public async getOne<T extends Resource>(
    resource: T,
    id: string,
  ): Promise<ResourceToType[T]> {
    const drizzleSchema = this.resourceToDrizzleSchema[resource];
    const zodSchema = this.resourceToZodSchema[resource];
    const table = this.resourceToTable[resource];
    const cache = QuestionBank.caches[resource];

    if (!cache[id]) {
      cache[id] = zodSchema.parse(
        await Content.db
          .select()
          .from(table)
          .where(
            and(eq(drizzleSchema.id, id), eq(drizzleSchema.status, "current")),
          )
          .execute()
          .then(takeOneOrThrow),
      );
    }

    return QuestionBank.caches[resource][id] as ResourceToType[T];
  }

  public async getSome<T extends Resource>(
    resource: T,
    ids: string[],
  ): Promise<ResourceToType[T][]> {
    if (!ids.length) return [];
    const drizzleSchema = this.resourceToDrizzleSchema[resource];
    const zodSchema = this.resourceToZodSchema[resource];
    const table = this.resourceToTable[resource];
    const cache = QuestionBank.caches[resource];

    const missingIds = ids.filter((id) => !cache[id]);
    if (missingIds.length) {
      zodSchema
        .array()
        .parse(
          await Content.db
            .select()
            .from(table)
            .where(
              and(
                eq(drizzleSchema.status, "current"),
                inArray(drizzleSchema.id, missingIds),
              ),
            )
            .execute(),
        )
        .forEach((item) => {
          cache[item.id] = item;
        });
    }

    const items = ids.map((id) => cache[id]);
    return items as ResourceToType[T][];
  }
}
