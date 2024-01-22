import MiniSearch from "minisearch";
import { z } from "zod";
import { questionBanks } from "@chair-flight/core/question-bank";
import { questionBankNameSchema as questionBank } from "@chair-flight/core/schemas";
import { publicProcedure, router } from "../config/trpc";
import type { QuestionBankName, QuestionId } from "@chair-flight/base/types";

type SearchField = "id" | "description";
type SearchDocument = Record<SearchField, string>;

type SearchResult = {
  id: string;
  href: string;
  description: string;
  subjects: string[];
  questions: Array<{ id: QuestionId; href: string }>;
  learningObjectives: Array<{ id: QuestionId; href: string }>;
};

let initializationWork: Promise<void> | undefined;

const RESULTS = new Map<string, SearchResult>();
const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: ["id", "description"] satisfies SearchField[],
  storeFields: ["id", "description"] satisfies SearchField[],
});

const populateSearchIndex = async (bank: QuestionBankName): Promise<void> => {
  const qb = questionBanks[bank];
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const annexes = await qb.getAll("annexes");
    const hasAnnexes = await qb.has("annexes");
    const firstId = annexes.at(0)?.id;

    if (!hasAnnexes) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = annexes.flatMap((annex) => ({
      id: annex.id,
      description: annex.description,
    }));

    const resultItems: SearchResult[] = annexes.flatMap((annex) => ({
      id: annex.id,
      href: annex.href,
      description: annex.description,
      subjects: annex.subjects,
      questions: annex.questions.map((id) => ({
        id,
        href: `/modules/${questionBank}/questions/${id}`,
      })),
      learningObjectives: annex.learningObjectives.map((id) => ({
        id,
        href: `/modules/${questionBank}/learning-objectives/${id}`,
      })),
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => RESULTS.set(r.id, r));
  })();

  await initializationWork;
};

export const questionBankAnnexSearchRouter = router({
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

      return { subjects };
    }),
  searchAnnexes: publicProcedure
    .input(
      z.object({
        questionBank,
        q: z.string(),
        subject: z.string(),
        limit: z.number().min(1).max(50),
        cursor: z.number().default(0),
      }),
    )
    .query(async ({ input }) => {
      const { q, questionBank, subject, limit, cursor } = input;

      await populateSearchIndex(questionBank);

      const opts = { fuzzy: 0.2 };

      const results = q
        ? SEARCH_INDEX.search(q, opts).map(({ id }) => RESULTS.get(id))
        : Array.from(RESULTS.values());

      const processedResults = results.filter((r): r is SearchResult => {
        if (!r) return false;
        if (subject !== "all" && !r.subjects.includes(subject)) return false;
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
