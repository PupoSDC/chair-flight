import { getUrlPathOnServer } from "@cf/base/env";
import { NotFoundError } from "@cf/base/errors";
import type {
  QuestionBankProvider,
  QuestionBankName,
  QuestionBankNameToType,
  QuestionBankResource,
  QuestionBankResourceArrays,
  QuestionBankResourceMaps,
} from "@cf/core/question-bank";

const resources: QuestionBankResource[] = [
  "questions",
  "learningObjectives",
  "annexes",
  "flashcards",
  "subjects",
  "courses",
  "docs",
];

export class QuestionBank implements QuestionBankProvider {
  private static instances: Record<string, QuestionBank> = {};

  private questionBankName: QuestionBankName;

  private resourceArrays: QuestionBankResourceArrays = resources.reduce(
    (s, r) => {
      s[r] = undefined;
      return s;
    },
    {} as QuestionBankResourceArrays,
  );

  private resourceMaps: QuestionBankResourceMaps = resources.reduce((s, r) => {
    s[r] = undefined;
    return s;
  }, {} as QuestionBankResourceMaps);

  private constructor(questionBankName: QuestionBankName) {
    this.questionBankName = questionBankName;
  }

  static get(name: QuestionBankName) {
    if (!QuestionBank.instances[name]) {
      QuestionBank.instances[name] = new QuestionBank(name);
    }
    return QuestionBank.instances[name];
  }

  getName() {
    return this.questionBankName;
  }

  async has(resource: QuestionBankResource) {
    const all = await this.getAll(resource);
    return all.length > 0;
  }

  async getAll<T extends QuestionBankResource>(resource: T) {
    if (!this.resourceArrays[resource]) {
      const urlPath = getUrlPathOnServer();
      const bankPath = `/content/${this.getName()}`;
      const baseApiPath = `${urlPath}${bankPath}`;
      const apiPath = `${baseApiPath}/${resource}.json`;
      const response = await fetch(apiPath); 
      const json = (await response.json()) as QuestionBankNameToType[T][];
      type ArrayType = (typeof this.resourceArrays)[typeof resource];
      this.resourceArrays[resource] = json as ArrayType;
    }
    const all = this.resourceArrays[resource] as QuestionBankNameToType[T][];
    return all;
  }

  async getSome<T extends QuestionBankResource>(resource: T, ids: string[]) {
    if (!ids.length) {
      return [];
    }
    if (!this.resourceMaps[resource]) {
      const all = await this.getAll(resource);
      const map = all.reduce<Record<string, QuestionBankNameToType[T]>>(
        (s, q) => {
          s[q.id] = q;
          return s;
        },
        {},
      );
      type MapType = (typeof this.resourceMaps)[typeof resource];
      this.resourceMaps[resource] = map as MapType;
    }
    const map = this.resourceMaps[resource] as Record<
      string,
      QuestionBankNameToType[T]
    >;
    return ids.map((id) => map[id]).filter(Boolean);
  }

  async getOne<T extends QuestionBankResource>(resource: T, id: string) {
    const data = (await this.getSome(resource, [id]))[0];
    if (!data) {
      throw new NotFoundError(`QuestionBank has no ${resource} with id ${id}`);
    }
    return data;
  }

  async preloadForStaticRender({ readFile }: MiniFs) {
    await Promise.all(
      resources.map(async (resource) => {
        const cwd = process.cwd();
        const appPath = "/apps/next-app";
        const path = [
          cwd,
          cwd.includes(appPath) ? "" : appPath,
          `/public/content/${this.getName()}`,
          `/${resource}.json`,
        ].join("");
        const file = JSON.parse(await readFile(path, "utf-8"));
        // @ts-expect-error Hard to type. Covered in tests
        this.resourceArrays[resource] = file;
      }),
    );
  }
}
