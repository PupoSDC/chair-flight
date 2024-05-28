import { count, eq } from "drizzle-orm";
import { NotFoundError } from "@cf/base/errors";
import { Content } from "./content";
import type {
  Annex,
  Course,
  Doc,
  LearningObjective,
  QuestionTemplate,
  Subject,
} from "@cf/core/content";

export type Resource =
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

  private static cacheHasAll = {
    questions: false,
    learningObjectives: false,
    annexes: false,
    subjects: false,
    courses: false,
    docs: false,
  };

  private static drizzleQuery = {
    questions: () => Content.db.query.questionTemplates,
    learningObjectives: () => Content.db.query.learningObjectives,
    annexes: () => Content.db.query.annexes,
    subjects: () => Content.db.query.subjects,
    courses: () => Content.db.query.courses,
    docs: () => Content.db.query.docs,
  };

  private static drizzleSchema = {
    questions: () => Content.schema.questionTemplates,
    learningObjectives: () => Content.schema.learningObjectives,
    annexes: () => Content.schema.annexes,
    subjects: () => Content.schema.subjects,
    courses: () => Content.schema.courses,
    docs: () => Content.schema.docs,
  };

  // This query is freaking expensive. It's hidden as protected so that
  // its only used when really needed (ie, the search provider)
  protected async getAll<R extends Resource, V extends ResourceToType[R]>(
    resource: R,
  ): Promise<V[]> {
    const cache = QuestionBank.cache[resource] as Record<string, V>;
    const cacheHasAll = QuestionBank.cacheHasAll[resource] as boolean;
    const drizzleQuery = QuestionBank.drizzleQuery[resource]();
    const drizzleSchema = QuestionBank.drizzleSchema[resource]();

    if (!cacheHasAll) {
      const [{ count: numberOfResources }] = await Content.db
        .select({ count: count() })
        .from(drizzleSchema)
        .where(eq(drizzleSchema.status, "current"));

      const limit = 1000;

      for (let i = 0; i < numberOfResources; i += limit) {
        const results = await drizzleQuery.findMany({
          where: (item, { eq }) => eq(item.status, "current"),
          limit: limit,
          offset: i,
        });
        results.forEach((res) => {
          cache[res.id] = res.document as V;
        });
      }

      QuestionBank.cacheHasAll[resource] = true;
    }

    return Object.values(cache);
  }

  public async getOne<R extends Resource, V extends ResourceToType[R]>(
    resource: R,
    id: string,
  ): Promise<V> {
    const cache = QuestionBank.cache[resource];
    const drizzleQuery = QuestionBank.drizzleQuery[resource]();

    if (!cache[id]) {
      const result = await drizzleQuery.findFirst({
        where: (item, { and, eq }) =>
          and(eq(item.id, id), eq(item.status, "current")),
      });

      if (!result) throw new NotFoundError(`${resource} ${id}`);
      cache[id] = result?.document;
    }
    return cache[id] as V;
  }

  public async getSome<R extends Resource, V extends ResourceToType[R]>(
    resource: R,
    ids: string[],
  ): Promise<V[]> {
    const cache = QuestionBank.cache[resource];
    const drizzleQuery = QuestionBank.drizzleQuery[resource]();
    const missingIds = ids.filter((id) => !cache[id]);

    if (missingIds.length) {
      const result = await drizzleQuery.findMany({
        where: (item, { and, eq, inArray }) =>
          and(inArray(item.id, ids), eq(item.status, "current")),
      });

      result.forEach((item) => {
        cache[item.id] = item.document;
      });
    }

    return ids.map((id) => cache[id]) as V[];
  }

  public async getTopLevelDocs(): Promise<Doc[]> {
    const result = await Content.db.query.docs.findMany({
      where: (item, { eq, and, sql }) =>
        and(eq(item.status, "current"), sql`NOT (document ? 'parentId')`),
    });
    return result.map((item) => item.document);
  }
}
