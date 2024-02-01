import { default as MiniSearch } from "minisearch";
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
import type { SearchOptions } from "minisearch";

type SearchDocument = {
  id: AnnexId;
  description: string;
};

type SearchResult = {
  id: AnnexId;
  href: string;
  questionBank: QuestionBankName;
  description: string;
  subjects: SubjectId[];
  questions: Array<{ id: QuestionId; href: string }>;
  learningObjectives: Array<{ id: LearningObjectiveId; href: string }>;
};

type SearchField = keyof SearchDocument;

let INITIALIZATION_WORK: Promise<void> | undefined;

const SEARCH_RESULTS = new Map<string, SearchResult>();

const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: ["id", "description"] satisfies SearchField[],
  storeFields: ["id"] satisfies SearchField[],
});

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

export const populateAnnexesSearchIndex = async (
  bank: QuestionBank,
): Promise<void> => {
  if (INITIALIZATION_WORK) await INITIALIZATION_WORK;

  INITIALIZATION_WORK = (async () => {
    const annexes = await bank.getAll("annexes");
    const hasAnnexes = await bank.has("annexes");
    const firstId = annexes.at(0)?.id;

    if (!hasAnnexes) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = annexes.flatMap((a) => ({
      id: a.id,
      description: a.description,
    }));

    const bankFolder = `/content/content-question-bank-${bank.getName()}`;
    const resultItems: SearchResult[] = annexes.flatMap((a) => ({
      id: a.id,
      href: `${bankFolder}/media/${a.id}.${a.format}`,
      description: a.description,
      subjects: a.subjects,
      questionBank: bank.getName(),
      questions: a.questions.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/questions/${id}`,
      })),
      learningObjectives: a.learningObjectives.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/learning-objectives/${id}`,
      })),
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => SEARCH_RESULTS.set(r.id, r));
  })();

  await INITIALIZATION_WORK;
};

export const searchAnnexes = async (
  ps: z.infer<typeof searchAnnexesParams>,
) => {
  const opts: SearchOptions = {
    fuzzy: 0.2,
  };

  const idSearchFields = ["id"];
  const results =
    ps.q 
      ? SEARCH_INDEX.search(ps.q, opts).map(({ id }) => SEARCH_RESULTS.get(id))
      : Array.from(SEARCH_RESULTS.values());

  const processedResults = results.filter((r): r is SearchResult => {
    return !(
      !r ||
      r.questionBank !== ps.questionBank ||
      !r.description.toLowerCase().includes(ps.q.toLowerCase())
    );
  });

  const finalItems = processedResults.slice(ps.cursor, ps.cursor + ps.limit);

  return {
    items: finalItems,
    totalResults: processedResults.length,
    nextCursor: ps.cursor + finalItems.length,
  };
};
