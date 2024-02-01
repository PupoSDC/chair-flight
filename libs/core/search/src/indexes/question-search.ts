import { z } from "zod";
import {
  questionBankNameSchema,
  type QuestionBank,
  type QuestionBankName,
  type QuestionId,
  type QuestionVariantId,
  type SubjectId,
} from "@chair-flight/core/question-bank";
import type { default as MiniSearch, SearchOptions } from "minisearch";

export type QuestionSearchField =
  | "id"
  | "questionId"
  | "questionBank"
  | "subjects"
  | "learningObjectives"
  | "externalIds"
  | "text";

export type QuestionSearchDocument = Record<QuestionSearchField, string>;

export type QuestionSearchResult = {
  id: string;
  questionBank: QuestionBankName;
  questionId: QuestionId;
  variantId: QuestionVariantId;
  subjects: SubjectId[];
  text: string;
  learningObjectives: Array<{
    name: string;
    href: string;
  }>;
  externalIds: string[];
  href: string;
};

let initializationWork: Promise<void> | undefined;

export const searchQuestionsParams = z.object({
  questionBank: questionBankNameSchema,
  q: z.string(),
  subject: z.string(),
  searchField: z.string(),
  limit: z.number().min(1).max(50),
  cursor: z.number().default(0),
});

export const getQuestionsSearchFilters = async (qb: QuestionBank) => {
  const rawSubjects = await qb.getAll("subjects");
  const subjects = rawSubjects.map((s) => ({
    id: s.id,
    text: `${s.id} - ${s.shortName}`,
  }));
  subjects.unshift({ id: "all", text: "All Subjects" });

  const searchFields: Array<{ id: QuestionSearchField | "all"; text: string }> =
    [
      { id: "all", text: "All Fields" },
      { id: "questionId", text: "Question ID" },
      { id: "learningObjectives", text: "Learning Objectives" },
      { id: "text", text: "Text" },
      { id: "externalIds", text: "External IDs" },
    ];

  return { subjects, searchFields };
};

export const populateQuestionsSearchIndex = async ({
  bank,
  searchIndex,
  searchResults,
}: {
  bank: QuestionBank;
  searchIndex: MiniSearch<QuestionSearchDocument>;
  searchResults: Map<string, QuestionSearchResult>;
}): Promise<void> => {
  if (initializationWork) await initializationWork;

  initializationWork = (async () => {
    const questions = await bank.getAll("questions");
    const hasQuestions = await bank.has("questions");
    const firstId = Object.values(questions.at(0)?.variants ?? []).at(0)?.id;

    if (!hasQuestions) return;
    if (searchIndex.has(firstId)) return;

    const searchItems: QuestionSearchDocument[] = questions.flatMap(
      (question) => {
        const subjects = question.learningObjectives.map(
          (l) => l.split(".")[0],
        );
        const los = question.learningObjectives.join(", ");
        const uniqueSubjects = [...new Set(subjects)];
        return Object.values(question.variants).map((variant) => ({
          id: variant.id,
          questionId: question.id,
          questionBank: bank.getName(),
          subjects: uniqueSubjects.join(", "),
          learningObjectives: los,
          externalIds: variant.externalIds.join(", "),
          text: getQuestionPreview(question, variant.id),
        }));
      },
    );

    const resultItems: QuestionSearchResult[] = questions.flatMap((q) => {
      const subjects = q.learningObjectives.map((l) => l.split(".")[0]);
      const uniqueSubjects = [...new Set(subjects)];
      return Object.values(q.variants).map((v) => ({
        questionBank: bank.getName(),
        id: v.id,
        questionId: q.id,
        variantId: v.id,
        text: getQuestionPreview(q, v.id),
        subjects: uniqueSubjects,
        learningObjectives: q.learningObjectives.map((name) => ({
          name,
          href: `/modules/${bank.getName()}/learning-objectives/${name}`,
        })),
        externalIds: v.externalIds,
        href: `/modules/${bank.getName()}/questions/${q.id}?variantId=${v.id}`,
      }));
    });

    await searchIndex.addAllAsync(searchItems);
    resultItems.forEach((r) => searchResults.set(r.id, r));
  })();

  await initializationWork;
};

export const searchQuestions = async ({
  params: ps,
  searchIndex,
  searchResults,
}: {
  params: z.infer<typeof searchQuestionsParams>;
  searchIndex: MiniSearch<QuestionSearchDocument>;
  searchResults: Map<string, QuestionSearchResult>;
}) => {
  const opts: SearchOptions = {
    fuzzy: 0.2,
    fields: ps.searchField === "all" ? undefined : [ps.searchField],
  };

  const results = ps.q
    ? searchIndex.search(ps.q, opts).map(({ id }) => searchResults.get(id))
    : Array.from(searchResults.values());

  const processedResults = results.filter((r): r is QuestionSearchResult => {
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
