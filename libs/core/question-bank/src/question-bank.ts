import { getUrlPathOnServer } from "@chair-flight/base/env";
import { NotFoundError, UnimplementedError } from "@chair-flight/base/errors";
import type {
  QuestionBankQuestionTemplate,
  QuestionBankMedia,
  QuestionBankLearningObjective,
  QuestionBankName,
  QuestionBankFlashcardCollection,
  QuestionBankSubject,
} from "@chair-flight/base/types";

type Resource =
  | "questions"
  | "learningObjectives"
  | "media"
  | "flashcards"
  | "subjects";

type NameToType = {
  questions: QuestionBankQuestionTemplate;
  learningObjectives: QuestionBankLearningObjective;
  media: QuestionBankMedia;
  flashcards: QuestionBankFlashcardCollection;
  subjects: QuestionBankSubject;
};

type ResourceArrays = {
  [K in Resource]: NameToType[K][] | undefined;
};

type ResourceMaps = {
  [K in Resource]: Record<string, NameToType[K]> | undefined;
};

type HasResourceMap = {
  [K in Resource]: boolean;
};

type ReadFile = (path: string, string: "utf-8") => Promise<string>;

interface IQuestionBank {
  getName: () => QuestionBankName;
  has: (r: Resource) => boolean;
  getAll: <T extends Resource>(r: T) => Promise<NameToType[T][]>;
  getSome: <T extends Resource>(r: T, id: string[]) => Promise<NameToType[T][]>;
  getOne: <T extends Resource>(r: T, id: string) => Promise<NameToType[T]>;
  preloadForStaticRender: (args: { readFile: ReadFile }) => Promise<void>;
}

const resources: Resource[] = [
  "questions",
  "learningObjectives",
  "media",
  "flashcards",
  "subjects",
];

export class QuestionBank implements IQuestionBank {
  private questionBankName: QuestionBankName;

  private hasResourceMap: HasResourceMap = resources.reduce((s, r) => {
    s[r] = false;
    return s;
  }, {} as HasResourceMap);

  private resourceArrays: ResourceArrays = resources.reduce((s, r) => {
    s[r] = undefined;
    return s;
  }, {} as ResourceArrays);

  private resourceMaps: ResourceMaps = resources.reduce((s, r) => {
    s[r] = undefined;
    return s;
  }, {} as ResourceMaps);

  constructor({
    questionBankName,
    hasQuestions,
    hasLearningObjectives,
    hasMedia,
    hasFlashcards,
  }: {
    questionBankName: QuestionBankName;
    hasQuestions: boolean;
    hasLearningObjectives: boolean;
    hasMedia: boolean;
    hasFlashcards: boolean;
  }) {
    this.questionBankName = questionBankName;
    this.hasResourceMap.questions = hasQuestions;
    this.hasResourceMap.subjects = hasQuestions;
    this.hasResourceMap.learningObjectives = hasLearningObjectives;
    this.hasResourceMap.media = hasMedia;
    this.hasResourceMap.flashcards = hasFlashcards;
  }

  getName() {
    return this.questionBankName;
  }

  has(resource: Resource) {
    return this.hasResourceMap[resource];
  }

  async getAll<T extends Resource>(resource: T) {
    if (!this.has(resource)) {
      throw new UnimplementedError(`QuestionBank has no ${resource}`);
    }
    if (!this.resourceArrays[resource]) {
      const urlPath = getUrlPathOnServer();
      const bankPath = `/content/content-question-bank-${this.getName()}`;
      const baseApiPath = `${urlPath}${bankPath}`;
      const apiPath = `${baseApiPath}/${resource}.json`;
      const response = await fetch(apiPath);
      const json = (await response.json()) as NameToType[T][];
      type ArrayType = (typeof this.resourceArrays)[typeof resource];
      this.resourceArrays[resource] = json as ArrayType;
    }
    const all = this.resourceArrays[resource] as NameToType[T][];
    return all;
  }

  async getSome<T extends Resource>(resource: T, ids: string[]) {
    if (!ids.length) {
      return [];
    }
    if (!this.has(resource)) {
      throw new UnimplementedError(`QuestionBank has no ${resource}`);
    }
    if (!this.resourceMaps[resource]) {
      const all = await this.getAll(resource);
      const map = all.reduce<Record<string, NameToType[T]>>((s, q) => {
        s[q.id] = q;
        return s;
      }, {});
      type MapType = (typeof this.resourceMaps)[typeof resource];
      this.resourceMaps[resource] = map as MapType;
    }
    const map = this.resourceMaps[resource] as Record<string, NameToType[T]>;
    return ids.map((id) => map[id]).filter(Boolean);
  }

  async getOne<T extends Resource>(resource: T, id: string) {
    const data = (await this.getSome(resource, [id]))[0];
    if (!data) {
      throw new NotFoundError(`QuestionBank has no ${resource} with id ${id}`);
    }
    return data;
  }

  async preloadForStaticRender({
    readFile,
  }: {
    readFile: (path: string, string: "utf-8") => Promise<string>;
  }) {
    await Promise.all(
      Object.entries(this.hasResourceMap)
        .filter(([, has]) => has)
        .map(async ([resource]) => {
          const path = `${process.cwd()}/apps/next-app/public/content/content-question-bank-${this.getName()}/${resource}.json`;
          const file = JSON.parse(await readFile(path, "utf-8"));
          // @ts-expect-error Hard to type. Covered in tests
          this.resourceArrays[resource] = file;
        }),
    );
  }
}
