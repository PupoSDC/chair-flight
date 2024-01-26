import MiniSearch from "minisearch";
import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type {
  DocId,
  LearningObjectiveId,
  QuestionBankName,
  SubjectId,
} from "@chair-flight/base/types";

type SearchField = "id" | "learningObjectiveId" | "content" | "title";
type SearchDocument = Record<SearchField, string>;

type SearchResult = {
  id: DocId;
  title: string;
  subject: SubjectId;
  learningObjectiveId: LearningObjectiveId;
  empty: boolean;
  href: string;
};

let initializationWork: Promise<void> | undefined;

const RESULTS = new Map<string, SearchResult>();
const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: [
    "id",
    "learningObjectiveId",
    "content",
    "title",
  ] satisfies SearchField[],
  storeFields: [
    "id",
    "learningObjectiveId",
    "content",
    "title",
  ] satisfies SearchField[],
});

const populateSearchIndex = async (bank: QuestionBankName): Promise<void> => {
  const qb = questionBanks[bank];
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const docs = await qb.getAll("docs");
    const hasAnnexes = await qb.has("docs");
    const firstId = docs.at(0)?.id;

    if (!hasAnnexes) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = docs.flatMap((doc) => ({
      id: doc.id,
      learningObjectiveId: doc.learningObjectiveId,
      content: doc.content,
      title: doc.title,
    }));

    const resultItems: SearchResult[] = docs.flatMap((doc) => ({
      id: doc.id,
      learningObjectiveId: doc.learningObjectiveId,
      title: doc.title,
      empty: doc.empty,
      subject: doc.subjectId,
      href: `/modules/${bank}/docs/${doc.id}`,
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => RESULTS.set(r.id, r));
  })();

  await initializationWork;
};

export const questionBankDocSearchRouter = router({
  getSearchConfigFilters: publicProcedure
    .input(z.object({ questionBank }))
    .query(async ({ input }) => {
      const qb = questionBanks[input.questionBank];

      const rawSubjects = await qb.getAll("subjects");
      const subjects = rawSubjects.map((s) => ({
        id: s.id,
        text: `${s.id} - ${s.shortName}`,
      }));
      subjects.unshift({ id: "all", text: "All Subjects" });

      const searchFields = [
        { id: "all", text: "All Fields" },
        { id: "learningObjectiveId", text: "Learning Objective" },
        { id: "content", text: "Content" },
        { id: "title", text: "Title" },
      ];
      return { subjects, searchFields };
    }),
  searchDocs: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string(),
        subject: z.string(),
        searchField: z.string(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { q, questionBank, subject, limit, cursor } = input;

      await populateSearchIndex(questionBank);

      const searchFields =
        input.searchField === "all" ? undefined : [input.searchField];
      const opts = { fuzzy: 0.2, searchFields };

      const results = q
        ? SEARCH_INDEX.search(q, opts).map(({ id }) => RESULTS.get(id))
        : Array.from(RESULTS.values());

      const processedResults = results.filter((r): r is SearchResult => {
        if (!r) return false;
        if (subject !== "all" && r.subject !== subject) return false;
        return true;
      });

      const finalItems = processedResults.slice(cursor, cursor + limit);

      return {
        items: finalItems,
        totalResults: processedResults.length,
        nextCursor: cursor + finalItems.length,
      };
    }),
});
