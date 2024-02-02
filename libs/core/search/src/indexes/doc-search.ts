import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import {
  questionBankNameSchema,
  type DocId,
  type LearningObjectiveId,
  type QuestionBank,
  type QuestionBankName,
  type SubjectId,
} from "@chair-flight/core/question-bank";
import type { SearchOptions } from "minisearch";

type SearchDocument = {
  id: DocId;
  learningObjective: string;
  content: string;
  title: string;
};

type SearchResult = {
  id: DocId;
  questionBank: QuestionBankName;
  title: string;
  subject: SubjectId;
  empty: boolean;
  href: string;
  learningObjectives: Array<{
    id: LearningObjectiveId;
    href: string;
  }>;
};

type SearchField = keyof SearchDocument;

let INITIALIZATION_WORK: Promise<void> | undefined;

const SEARCH_RESULTS = new Map<string, SearchResult>();

const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: [
    "id",
    "learningObjective",
    "content",
    "title",
  ] satisfies SearchField[],
  storeFields: ["id"] satisfies SearchField[],
});

const populateSearchIndex = async (bank: QuestionBank): Promise<void> => {
  if (INITIALIZATION_WORK) await INITIALIZATION_WORK;

  INITIALIZATION_WORK = (async () => {
    const docs = await bank.getAll("docs");
    const hasDocs = await bank.has("docs");
    const firstId = docs.at(0)?.id;

    if (!hasDocs) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = docs.flatMap((doc) => ({
      id: doc.id,
      learningObjective: doc.learningObjectives.join(", "),
      content: doc.content,
      title: doc.title,
    }));

    const resultItems: SearchResult[] = docs.flatMap((doc) => ({
      id: doc.id,
      questionBank: bank.getName(),
      title: doc.title,
      subject: doc.subject,
      empty: doc.empty,
      href: `/modules/${bank.getName()}/docs/${doc.id}`,
      learningObjectives: doc.learningObjectives.map((lo) => ({
        id: lo,
        href: `/modules/${bank.getName()}/learning-objectives/${lo}`,
      })),
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => SEARCH_RESULTS.set(r.id, r));
  })();

  await INITIALIZATION_WORK;
};

export const searchDocsParams = z.object({
  questionBank: questionBankNameSchema,
  q: z.string(),
  subject: z.string(),
  searchField: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

export const getDocsSearchFilters = async (qb: QuestionBank) => {
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
};

export const searchDocs = async (
  bank: QuestionBank,
  ps: z.infer<typeof searchDocsParams>,
) => {
  await populateSearchIndex(bank);

  const opts: SearchOptions = {
    fuzzy: 0.2,
    fields: ps.searchField === "all" ? undefined : [ps.searchField],
  };

  const idSearchFields = ["id", "learningObjectives"];
  const results =
    ps.q && idSearchFields.includes(ps.searchField)
      ? SEARCH_INDEX.search(ps.q, opts).map(({ id }) => SEARCH_RESULTS.get(id))
      : Array.from(SEARCH_RESULTS.values());

  const processedResults = results.filter((r): r is SearchResult => {
    return !(
      !r ||
      r.questionBank !== ps.questionBank ||
      (ps.subject !== "all" && r.subject !== ps.subject) ||
      (ps.searchField === "id" && !r.id.startsWith(ps.q)) ||
      (ps.searchField === "learningObjectives" &&
        !r.learningObjectives.some((lo) => lo.id.startsWith(ps.q)))
    );
  });

  const finalItems = processedResults.slice(ps.cursor, ps.cursor + ps.limit);

  return {
    items: finalItems,
    totalResults: processedResults.length,
    nextCursor: ps.cursor + finalItems.length,
  };
};

export const getDocSearchResults = async (
  bank: QuestionBank,
  ids: string[],
) => {
  await populateSearchIndex(bank);
  return ids.map((id) => SEARCH_RESULTS.get(id)).filter(Boolean);
};
