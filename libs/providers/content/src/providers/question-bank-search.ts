import { default as MiniSearch } from "minisearch";
import { getQuestionPreview } from "@cf/core/content";
import { QuestionBank } from "./question-bank";
import type { Resource } from "./question-bank";
import type {
  QuestionBankName,
  QuestionBankSearchParams,
} from "@cf/core/content";
import type { SearchResult } from "minisearch";

type SearchDocument = {
  id: `${Resource}-${string}`;
  resource: Resource;
  resourceId: string;
  externalIds: string;
  learningObjective: string;
  text: string;
  questionBank: QuestionBankName;
};

export class QuestionBankSearch extends QuestionBank {
  private static initJob: Promise<void>;

  private static searchIndex = new MiniSearch<SearchDocument>({
    storeFields: [
      "id",
      "resource",
      "resourceId",
      "questionBank",
    ] satisfies Array<keyof SearchDocument>,
    fields: [
      "resource",
      "resourceId",
      "externalIds",
      "learningObjective",
      "text",
      "questionBank",
    ] satisfies Array<keyof SearchDocument>,
    tokenize: (text, fieldName) => {
      if (fieldName === "learningObjective") return text.split(", ");
      return MiniSearch.getDefault("tokenize")(text);
    },
  });

  private async initQuestions() {
    const questions = await this.getAll("questions");
    QuestionBankSearch.searchIndex.addAllAsync(
      questions.map((q) => ({
        id: `questions-${q.id}` as const,
        resource: "questions" as const,
        resourceId: q.id,
        externalIds: q.externalIds.join(" "),
        learningObjective: q.learningObjectives.join(" "),
        text: getQuestionPreview(q.variant),
        questionBank: q.questionBank,
      })),
    );
  }

  private async initAnnexes() {
    const annexes = await this.getAll("annexes");
    QuestionBankSearch.searchIndex.addAllAsync(
      annexes.map((a) => ({
        id: `annexes-${a.id}` as const,
        resource: "annexes" as const,
        resourceId: a.id,
        externalIds: "",
        learningObjective: a.learningObjectives.join(" "),
        text: a.description,
        questionBank: a.questionBank,
      })),
    );
  }

  private async initLearningObjectives() {
    const los = await this.getAll("learningObjectives");
    QuestionBankSearch.searchIndex.addAllAsync(
      los.map((lo) => ({
        id: `learningObjectives-${lo.id}` as const,
        resource: "learningObjectives" as const,
        resourceId: lo.id,
        externalIds: "",
        learningObjective: lo.id,
        text: lo.text + " " + lo.source,
        questionBank: lo.questionBank,
      })),
    );
  }

  private async initDocs() {
    const docs = await this.getAll("docs");
    QuestionBankSearch.searchIndex.addAllAsync(
      docs.map((d) => ({
        id: `docs-${d.id}` as const,
        resource: "docs" as const,
        resourceId: d.id,
        externalIds: "",
        learningObjective: d.learningObjectives.join(" "),
        text: d.title + " " + d.content,
        questionBank: d.questionBank,
      })),
    );
  }

  private async init() {
    QuestionBankSearch.initJob ??= (async () => {
      await Promise.all([
        this.initQuestions(),
        this.initAnnexes(),
        this.initLearningObjectives(),
        this.initDocs(),
      ]);
    })();
    await QuestionBankSearch.initJob;
  }

  public async searchForAutocomplete(query: string) {
    await this.init();

    const isAtplSearch = query.toLowerCase().startsWith("atpl");
    const isPrepSearch = query.toLowerCase().startsWith("prep");
    const isTypeSearch = query.toLowerCase().startsWith("type");

    const queryWithoutBank = query.replace(/atpl|prep|type/gi, "").trim();

    const isQuestionSearch =
      false ||
      queryWithoutBank.match(/Q[0-9]{4}/) ||
      queryWithoutBank.toLowerCase().startsWith("question");
    const isLoSearch =
      false ||
      queryWithoutBank.toLowerCase().startsWith("lo ") ||
      queryWithoutBank.toLowerCase().startsWith("learning objective");
    const isDocSearch =
      false || queryWithoutBank.toLowerCase().startsWith("doc ");
    const isAnnexSearch =
      false ||
      queryWithoutBank.match(/A[0-9]{4}/) ||
      queryWithoutBank.toLowerCase().startsWith("annex");

    const queryWithoutShortcut = queryWithoutBank
      .replace(/question|lo|learning objective|doc/gi, "")
      .trim();

    return await Promise.all(
      QuestionBankSearch.searchIndex
        .search(queryWithoutShortcut, {
          fuzzy: 0.2,
          boost: { resourceId: 2 },
          filter: (doc) => {
            if (isAtplSearch && doc["questionBank"] !== "atpl") return false;
            if (isPrepSearch && doc["questionBank"] !== "prep") return false;
            if (isTypeSearch && doc["questionBank"] !== "type") return false;
            if (isQuestionSearch && doc["resource"] !== "questions")
              return false;
            if (isLoSearch && doc["resource"] !== "learningObjectives")
              return false;
            if (isDocSearch && doc["resource"] !== "docs") return false;
            if (isAnnexSearch && doc["resource"] !== "annexes") return false;
            return true;
          },
        })
        .slice(0, 4)
        .map(async (result: SearchResult) => {
          const id = result["resourceId"] as string;
          const type = result["resource"] as Resource;
          if (type === "questions") {
            const question = await this.getOne("questions", id);
            return {
              id: question.id,
              resource: "questions" satisfies Resource,
              type: "Question",
              questionBank: question.questionBank,
              text: getQuestionPreview(question.variant),
            };
          }
          if (type === "annexes") {
            const annex = await this.getOne("annexes", id);
            return {
              id: annex.id,
              resource: "annexes" satisfies Resource,
              type: "Annex",
              questionBank: annex.questionBank,
              text: annex.description,
            };
          }
          if (type === "learningObjectives") {
            const learningObjective = await this.getOne(
              "learningObjectives",
              id,
            );
            return {
              id: learningObjective.id,
              resource: "learningObjectives" satisfies Resource,
              type: "Learning Objective",
              questionBank: learningObjective.questionBank,
              text: learningObjective.text,
            };
          }
          if (type === "docs") {
            const doc = await this.getOne("docs", id);
            return {
              id: doc.id,
              resource: "docs" satisfies Resource,
              type: "Doc",
              questionBank: doc.questionBank,
              text: doc.title,
            };
          }
          throw new Error("Unknown type");
        }),
    );
  }

  public async search(params: QuestionBankSearchParams) {
    await this.init();
    const result = QuestionBankSearch.searchIndex
      .search(params.q, {
        fuzzy: 2,
        prefix: true,
      })
      .slice(params.cursor, params.cursor + params.limit);
    return result;
  }
}
