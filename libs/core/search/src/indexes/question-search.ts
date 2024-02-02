import { default as MiniSearch } from "minisearch";
import { z } from "zod";
import {
  questionBankNameSchema,
  getQuestionPreview,
} from "@chair-flight/core/question-bank";
import type {
  QuestionBank,
  QuestionBankName,
  QuestionId,
  SubjectId,
} from "@chair-flight/core/question-bank";
import type { SearchOptions } from "minisearch";

type SearchDocument = {
  id: QuestionId;
  subjects: string;
  learningObjectives: string;
  externalIds: string;
  explanation: string;
  text: string;
};

type SearchResult = {
  id: string;
  questionBank: QuestionBankName;
  subjects: SubjectId[];
  text: string;
  externalIds: string[];
  href: string;
  learningObjectives: Array<{
    id: string;
    href: string;
  }>;
  relatedQuestions: Array<{
    id: string;
    href: string;
  }>;
};

type SearchField = keyof SearchDocument;

let INITIALIZATION_WORK: Promise<void> | undefined;

const SEARCH_INDEX = new MiniSearch<SearchDocument>({
  fields: [
    "id",
    "subjects",
    "learningObjectives",
    "externalIds",
    "explanation",
    "text",
  ] satisfies SearchField[],
  storeFields: ["id"] satisfies SearchField[],
  tokenize: (s, fieldName) => {
    if (fieldName === "learningObjectives") return s.split(", ");
    return MiniSearch.getDefault("tokenize")(s, fieldName);
  },
});

const SEARCH_RESULTS = new Map<string, SearchResult>();

const populateSearchIndex = async (bank: QuestionBank): Promise<void> => {
  if (INITIALIZATION_WORK) await INITIALIZATION_WORK;

  INITIALIZATION_WORK = (async () => {
    const hasQuestions = await bank.has("questions");
    const questions = await bank.getAll("questions");
    const firstId = questions.at(0)?.id;

    if (!hasQuestions) return;
    if (SEARCH_INDEX.has(firstId)) return;

    const searchItems: SearchDocument[] = questions.map((q) => ({
      id: q.id,
      subjects: q.subjects.join(", "),
      learningObjectives: q.learningObjectives.join(", "),
      externalIds: q.externalIds.join(", "),
      explanation: q.explanation,
      text: getQuestionPreview(q),
    }));

    const resultItems: SearchResult[] = questions.map((q) => ({
      id: q.id,
      questionBank: bank.getName(),
      subjects: q.subjects,
      text: getQuestionPreview(q),
      externalIds: q.externalIds,
      href: `/modules/${bank.getName()}/questions/${q.id}`,
      learningObjectives: q.learningObjectives.map((lo) => ({
        id: lo,
        href: `/modules/${bank.getName()}/learning-objectives/${lo}`,
      })),
      relatedQuestions: q.relatedQuestions.map((id) => ({
        id,
        href: `/modules/${bank.getName()}/questions/${id}`,
      })),
    }));

    await SEARCH_INDEX.addAllAsync(searchItems);
    resultItems.forEach((r) => SEARCH_RESULTS.set(r.id, r));
  })();

  await INITIALIZATION_WORK;
};

export const searchQuestionsParams = z.object({
  questionBank: questionBankNameSchema,
  q: z.string(),
  subject: z.string(),
  searchField: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

export const getQuestionsSearchFilters = async (bank: QuestionBank) => {
  const rawSubjects = await bank.getAll("subjects");
  const subjects = rawSubjects.map((s) => ({
    id: s.id,
    text: `${s.id} - ${s.shortName}`,
  }));
  subjects.unshift({ id: "all", text: "All Subjects" });

  const searchFields: Array<{
    id: SearchField | "all";
    text: string;
  }> = [
    { id: "all", text: "All Fields" },
    { id: "id", text: "Question ID" },
    { id: "learningObjectives", text: "Learning Objectives" },
    { id: "text", text: "Text" },
    { id: "externalIds", text: "External IDs" },
  ];

  return { subjects, searchFields };
};

export const searchQuestions = async (
  bank: QuestionBank,
  ps: z.infer<typeof searchQuestionsParams>,
) => {
  await populateSearchIndex(bank);

  const idSearchFields = ["id", "learningObjectives"];

  const opts: SearchOptions = {
    fuzzy: idSearchFields.includes(ps.searchField) ? false : 0.2,
    prefix: idSearchFields.includes(ps.searchField),
    fields: ps.searchField === "all" ? undefined : [ps.searchField],
    tokenize: (s) => {
      if (ps.searchField === "learningObjectives") return s.split(", ");
      return MiniSearch.getDefault("tokenize")(s);
    },
  };

  const results = ps.q
    ? SEARCH_INDEX.search(ps.q, opts).map(({ id }) => SEARCH_RESULTS.get(id))
    : Array.from(SEARCH_RESULTS.values());

  const processedResults = results.filter((r): r is SearchResult => {
    if (!r) return false;
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

export const getQuestionSearchResults = async (
  bank: QuestionBank,
  ids: string[],
) => {
  await populateSearchIndex(bank);
  return ids.map((id) => SEARCH_RESULTS.get(id)).filter(Boolean);
};
