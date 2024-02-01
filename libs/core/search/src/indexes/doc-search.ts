import { z } from "zod";
import {
  questionBankNameSchema,
  type DocId,
  type LearningObjectiveId,
  type QuestionBank,
  type QuestionBankName,
  type SubjectId,
} from "@chair-flight/core/question-bank";
import type { default as MiniSearch, SearchOptions } from "minisearch";

export type DocSearchField = "id" | "learningObjectiveId" | "content" | "title";
export type DocSearchDocument = Record<DocSearchField, string>;

export type DocSearchResult = {
  id: DocId;
  questionBank: QuestionBankName;
  title: string;
  subject: SubjectId;
  empty: boolean;
  href: string;
  learningObjective: {
    id: LearningObjectiveId;
    href: string;
  };
};

let initializationWork: Promise<void> | undefined;

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

export const populateDocsSearchIndex = async ({
  bank,
  searchIndex,
  searchResults,
}: {
  bank: QuestionBank;
  searchIndex: MiniSearch<DocSearchDocument>;
  searchResults: Map<string, DocSearchResult>;
}): Promise<void> => {
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const docs = await bank.getAll("docs");
    const hasDocs = await bank.has("docs");
    const firstId = docs.at(0)?.id;

    if (!hasDocs) return;
    if (searchIndex.has(firstId)) return;

    const searchItems: DocSearchDocument[] = docs.flatMap((doc) => ({
      id: doc.id,
      learningObjectiveId: doc.learningObjectiveId,
      content: doc.content,
      title: doc.title,
    }));

    const resultItems: DocSearchResult[] = docs.flatMap((doc) => ({
      id: doc.id,
      questionBank: bank.getName(),
      title: doc.title,
      empty: doc.empty,
      subject: doc.subjectId,
      href: `/modules/${bank.getName()}/docs/${doc.id}`,
      learningObjective: {
        id: doc.learningObjectiveId,
        href: `/modules/${bank.getName()}/learning-objectives/${doc.learningObjectiveId}`,
      },
    }));

    await searchIndex.addAllAsync(searchItems);
    resultItems.forEach((r) => searchResults.set(r.id, r));
  })();

  await initializationWork;
};

export const searchDocs = async ({
  params: ps,
  searchIndex,
  searchResults,
}: {
  params: z.infer<typeof searchDocsParams>;
  searchIndex: MiniSearch<DocSearchDocument>;
  searchResults: Map<string, DocSearchResult>;
}) => {
  const opts: SearchOptions = {
    fuzzy: 0.2,
    fields: ps.searchField === "all" ? undefined : [ps.searchField],
  };

  const results = ps.q
    ? searchIndex.search(ps.q, opts).map(({ id }) => searchResults.get(id))
    : Array.from(searchResults.values());

  const processedResults = results.filter((r): r is DocSearchResult => {
    if (!r) return false;
    if (r.questionBank !== ps.questionBank) return false;
    if (ps.subject !== "all" && r.subject !== ps.subject) return false;
    return true;
  });

  const finalItems = processedResults.slice(ps.cursor, ps.cursor + ps.limit);

  return {
    items: finalItems,
    totalResults: processedResults.length,
    nextCursor: ps.cursor + finalItems.length,
  };
};
