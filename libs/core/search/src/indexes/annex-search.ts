import { z } from "zod";
import {
  questionBankNameSchema,
  type AnnexId,
  type LearningObjectiveId,
  type QuestionBank,
  type QuestionBankName,
  type QuestionId,
  type SubjectId,
} from "@chair-flight/core/question-bank";
import type { default as MiniSearch, SearchOptions } from "minisearch";

export type AnnexSearchField = "id" | "description";
export type AnnexSearchDocument = Record<AnnexSearchField, string>;

export type AnnexSearchResult = {
  id: AnnexId;
  href: string;
  questionBank: QuestionBankName;
  description: string;
  subjects: SubjectId[];
  questions: Array<{ id: QuestionId; href: string }>;
  learningObjectives: Array<{ id: LearningObjectiveId; href: string }>;
};

let initializationWork: Promise<void> | undefined;

export const searchAnnexesParams = z.object({
  questionBank: questionBankNameSchema,
  q: z.string(),
  subject: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

export const getAnnexesSearchFilters = async (qb: QuestionBank) => {
  const rawSubjects = await qb.getAll("subjects");
  const subjects = rawSubjects.map((s) => ({
    id: s.id,
    text: `${s.id} - ${s.shortName}`,
  }));
  subjects.unshift({ id: "all", text: "All Subjects" });

  return { subjects };
};

export const populateAnnexesSearchIndex = async ({
  bank,
  searchIndex,
  searchResults,
}: {
  bank: QuestionBank;
  searchIndex: MiniSearch<AnnexSearchDocument>;
  searchResults: Map<string, AnnexSearchResult>;
}): Promise<void> => {
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const annexes = await bank.getAll("annexes");
    const hasAnnexes = await bank.has("annexes");
    const firstId = annexes.at(0)?.id;

    if (!hasAnnexes) return;
    if (searchIndex.has(firstId)) return;

    const searchItems: AnnexSearchDocument[] = annexes.flatMap((annex) => ({
      id: annex.id,
      description: annex.description,
    }));

    const resultItems: AnnexSearchResult[] = annexes.flatMap((annex) => ({
      id: annex.id,
      href: annex.href,
      description: annex.description,
      subjects: annex.subjects,
      questionBank: bank.getName(),
      questions: annex.questions.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/questions/${id}`,
      })),
      learningObjectives: annex.learningObjectives.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/learning-objectives/${id}`,
      })),
    }));

    await searchIndex.addAllAsync(searchItems);
    resultItems.forEach((r) => searchResults.set(r.id, r));
  })();

  await initializationWork;
};

export const searchAnnexes = async ({
  params: ps,
  searchIndex,
  searchResults,
}: {
  params: z.infer<typeof searchAnnexesParams>;
  searchIndex: MiniSearch<AnnexSearchDocument>;
  searchResults: Map<string, AnnexSearchResult>;
}) => {
  const opts: SearchOptions = {
    fuzzy: 0.2,
  };

  const results = ps.q
    ? searchIndex.search(ps.q, opts).map(({ id }) => searchResults.get(id))
    : Array.from(searchResults.values());

  const processedResults = results.filter((r): r is AnnexSearchResult => {
    if (!r) return false;
    if (r.questionBank !== ps.questionBank) return false;
    if (ps.subject !== "all" && !r.subjects.includes(ps.subject)) return false;
    return true;
  });

  const finalItems = processedResults.slice(ps.cursor, ps.cursor + ps.limit);

  return {
    items: finalItems,
    totalResults: processedResults.length,
    nextCursor: ps.cursor + finalItems.length,
  };
};
