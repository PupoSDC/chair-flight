import { getUrlPathOnServer } from "@chair-flight/base/env";
import { NotFoundError } from "@chair-flight/base/errors";
import { QuestionTemplate } from "../types/question-templates";
import { LearningObjective } from "../types/learning-objective";
import { Annex } from "../types/annex";
import { FlashcardCollection } from "../types/flashcard";

type NameToType = {
  questions: QuestionTemplate;
  learningObjectives: LearningObjective;
  annexes: Annex;
  flashcards: FlashcardCollection;
  subjects: QuestionBankSubject;
  courses: QuestionBankCourse;
  docs: Doc;
};

type ResourceArrays = {
  [K in Resource]: NameToType[K][] | undefined;
};

type ResourceMaps = {
  [K in Resource]: Record<string, NameToType[K]> | undefined;
};

type ReadFile = (path: string, string: "utf-8") => Promise<string>;

interface IQuestionBank {
  getName: () => BankName;
  has: (r: Resource) => Promise<boolean>;
  getAll: <T extends Resource>(r: T) => Promise<NameToType[T][]>;
  getSome: <T extends Resource>(r: T, id: string[]) => Promise<NameToType[T][]>;
  getOne: <T extends Resource>(r: T, id: string) => Promise<NameToType[T]>;
  preloadForStaticRender: (args: { readFile: ReadFile }) => Promise<void>;
}

const resources: Resource[] = [
  "questions",
  "learningObjectives",
  "annexes",
  "flashcards",
  "subjects",
  "courses",
  "docs",
];

export class QuestionBank implements IQuestionBank {
  private questionBankName: BankName;

  private resourceArrays: ResourceArrays = resources.reduce((s, r) => {
    s[r] = undefined;
    return s;
  }, {} as ResourceArrays);

  private resourceMaps: ResourceMaps = resources.reduce((s, r) => {
    s[r] = undefined;
    return s;
  }, {} as ResourceMaps);

  constructor(questionBankName: BankName) {
    this.questionBankName = questionBankName;
  }

  getName() {
    return this.questionBankName;
  }

  async has(resource: Resource) {
    const all = await this.getAll(resource);
    return all.length > 0;
  }

  async getAll<T extends Resource>(resource: T) {
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

  async preloadForStaticRender({ readFile }: { readFile: ReadFile }) {
    await Promise.all(
      resources.map(async (resource) => {
        const cwd = process.cwd();
        const appPath = "/apps/next-app";
        const path = [
          cwd,
          cwd.includes(appPath) ? "" : appPath,
          `/public/content/content-question-bank-${this.getName()}`,
          `/${resource}.json`,
        ].join("");
        const file = JSON.parse(await readFile(path, "utf-8"));
        // @ts-expect-error Hard to type. Covered in tests
        this.resourceArrays[resource] = file;
      }),
    );
  }
}
