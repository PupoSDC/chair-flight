import { NotFoundError } from "@cf/base/errors";
import {
  annexSchema,
  courseSchema,
  docSchema,
  learningObjectiveSchema,
  questionTemplateSchema,
  subjectSchema,
} from "@cf/core/content";
import { Content } from "./content";
import type {
  Annex,
  Course,
  Doc,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/content";

type Resource =
  | "questions"
  | "learningObjectives"
  | "annexes"
  | "subjects"
  | "courses"
  | "docs";

type ResourceToType = {
  questions: QuestionTemplate;
  learningObjectives: LearningObjective;
  annexes: Annex;
  subjects: Subject;
  courses: Course;
  docs: Doc;
};

export class QuestionBank extends Content {
  private static cache = {
    questions: {} as Record<string, QuestionTemplate>,
    learningObjectives: {} as Record<string, LearningObjective>,
    annexes: {} as Record<string, Annex>,
    subjects: {} as Record<string, Subject>,
    courses: {} as Record<string, Course>,
    docs: {} as Record<string, Doc>,
  };

  private static drizzleQuery = {
    questions: () => Content.db.query.questionTemplates,
    learningObjectives: () => Content.db.query.learningObjectives,
    annexes: () => Content.db.query.annexes,
    subjects: () => Content.db.query.subjects,
    courses: () => Content.db.query.courses,
    docs: () => Content.db.query.docs,
  };

  private static zodSchema = {
    questions: questionTemplateSchema,
    learningObjectives: learningObjectiveSchema,
    annexes: annexSchema,
    subjects: subjectSchema,
    courses: courseSchema,
    docs: docSchema,
  };

  public async getOne<R extends Resource, V extends ResourceToType[R]>(
    resource: R,
    id: string,
  ): Promise<V> {
    const cache = QuestionBank.cache[resource];
    const drizzleQuery = QuestionBank.drizzleQuery[resource]();
    const zodSchema = QuestionBank.zodSchema[resource];

    if (!cache[id]) {
      const result = await drizzleQuery.findFirst({
        where: (item, { and, eq }) =>
          and(eq(item.id, id), eq(item.status, "current")),
      });

      if (!result) throw new NotFoundError(`${resource} ${id}`);
      const parsedResult = zodSchema.parse(result?.document);
      cache[id] = parsedResult;
    }
    return cache[id] as V;
  }

  public async getSome<R extends Resource, V extends ResourceToType[R]>(
    resource: R,
    ids: string[],
  ): Promise<V[]> {
    const cache = QuestionBank.cache[resource];
    const drizzleQuery = QuestionBank.drizzleQuery[resource]();
    const zodSchema = QuestionBank.zodSchema[resource];
    const missingIds = ids.filter((id) => !cache[id]);

    if (missingIds.length) {
      const result = await drizzleQuery.findMany({
        where: (item, { and, eq, inArray }) =>
          and(inArray(item.id, ids), eq(item.status, "current")),
      });

      result.forEach((item) => {
        const parsedResult = zodSchema.parse(item.document);
        cache[item.id] = parsedResult;
      });
    }

    return ids.map((id) => cache[id]) as V[];
  }
}
