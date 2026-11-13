import { keepUnique } from "../../base/keep-unique.ts";
import { getQuestionPreview } from "./get-question-preview.ts";
import type { QuestionBankName } from "./question-banks.ts";
import type { QuestionVariant } from "./question-variant.ts";

const ANNEX_MATCH = /(!\[[^\]]*\]\()annex:([^)]*)\)/g;

const getAnnexReferences = (text: string) =>
  keepUnique(Array.from(text.matchAll(ANNEX_MATCH), (match) => match[2]));

export const connectQuestionBank = (raw: {
  questionBank: QuestionBankName;
  annexBaseUrl: string;
  subjects: {
    id: string;
    longName: string;
    shortName: string;
    numberOfExamQuestions: number;
    numberOfExamMinutes: number;
  }[];
  learningObjectives: {
    id: string;
    parentId: string | null;
    subject: string | null;
    courses: string[] | null;
    text: string;
    source: string | null;
  }[];
  docs: {
    id: string;
    parentId: string | null;
    title: string;
    description: string;
    content: string;
  }[];
  questions: {
    id: string;
    relatedQuestions: string[] | null;
    externalIds: string[] | null;
    annexes: string[] | null;
    learningObjectives: string[];
    explanation: string | null;
    variant: QuestionVariant;
  }[];
  annexes: {
    id: string;
    description: string | null;
    format: string;
    source: string | null;
  }[];
}) => {
  const { questionBank } = raw;
  const losById = new Map(raw.learningObjectives.map((lo) => [lo.id, lo]));
  const docIds = new Set(raw.docs.map((doc) => doc.id));
  const rawAnnexesById = new Map(raw.annexes.map((annex) => [annex.id, annex]));
  const rawQuestions = [
    ...new Map(raw.questions.map((question) => [question.id, question])),
  ].map(([, question]) => question);

  const getLoLineage = (loId: string): string[] => {
    const lo = losById.get(loId);
    if (!lo) return [];
    return [lo.id, ...(lo.parentId ? getLoLineage(lo.parentId) : [])];
  };

  const getLoDocId = (loId: string) => {
    const docId = getLoLineage(loId).find((id) => docIds.has(id));
    if (!docId) throw new Error(`Unable to connect lo ${loId} to a doc.`);
    return docId;
  };

  const getAnnexHref = (annexId: string) => {
    const annex = rawAnnexesById.get(annexId);
    if (!annex) throw new Error(`Missing annex ${annexId}.`);
    return `${raw.annexBaseUrl}/${questionBank}/${annex.id}.${annex.format}`;
  };

  const replaceAnnexLinks = (text: string) =>
    text.replaceAll(
      ANNEX_MATCH,
      (_, prefix: string, id: string) => `${prefix}${getAnnexHref(id)})`,
    );

  const questions = rawQuestions.map((question) => {
    const learningObjectives = question.learningObjectives.filter((id) =>
      losById.has(id),
    );
    const docLo = learningObjectives.reduce<string | undefined>(
      (shortest, id) =>
        shortest && shortest.length <= id.length ? shortest : id,
      undefined,
    );
    if (!docLo) throw new Error(`Question ${question.id} has no valid lo.`);
    const explanation = question.explanation ?? "";
    return {
      questionBank,
      id: question.id,
      docId: getLoDocId(docLo),
      subjects: keepUnique(
        learningObjectives.flatMap((id) => losById.get(id)?.subject ?? []),
      ),
      learningObjectives,
      annexes: keepUnique([
        ...(question.annexes ?? []),
        ...getAnnexReferences(explanation),
      ]),
      relatedQuestions: question.relatedQuestions ?? [],
      externalIds: question.externalIds ?? [],
      explanation: replaceAnnexLinks(explanation),
      preview: getQuestionPreview(question.variant),
      variant: question.variant,
    };
  });

  const questionIdsByLo = questions.reduce((result, question) => {
    const loIds = keepUnique(question.learningObjectives.flatMap(getLoLineage));
    for (const loId of loIds) {
      result.set(loId, (result.get(loId) ?? new Set()).add(question.id));
    }
    return result;
  }, new Map<string, Set<string>>());

  const learningObjectives = raw.learningObjectives.map((lo) => ({
    questionBank,
    id: lo.id,
    parentId: lo.parentId || null,
    subject: lo.subject ?? "",
    docId: getLoDocId(lo.id),
    courses: lo.courses ?? [],
    text: lo.text,
    source: String(lo.source ?? ""),
    numberOfQuestions: questionIdsByLo.get(lo.id)?.size ?? 0,
  }));

  const subjects = raw.subjects.map((subject) => ({
    questionBank,
    id: subject.id,
    longName: subject.longName,
    shortName: subject.shortName,
    numberOfExamQuestions: subject.numberOfExamQuestions,
    numberOfExamMinutes: subject.numberOfExamMinutes,
    numberOfQuestions: questions.filter((question) =>
      question.subjects.includes(subject.id),
    ).length,
  }));

  const docs = raw.docs.map((doc) => ({
    questionBank,
    id: doc.id,
    parentId: doc.parentId,
    subject: losById.get(doc.id)?.subject ?? null,
    title: doc.title,
    description: doc.description,
    content: replaceAnnexLinks(doc.content),
    empty: !doc.content,
  }));

  const annexes = [...rawAnnexesById.values()].map((annex) => {
    const annexQuestions = questions.filter((question) =>
      question.annexes.includes(annex.id),
    );
    const annexDocs = raw.docs.filter((doc) =>
      getAnnexReferences(doc.content).includes(annex.id),
    );
    const annexLos = keepUnique([
      ...annexQuestions.flatMap((question) => question.learningObjectives),
      ...annexDocs.flatMap((doc) =>
        learningObjectives.filter((lo) => lo.docId === doc.id).map((l) => l.id),
      ),
    ]);
    return {
      questionBank,
      id: annex.id,
      href: getAnnexHref(annex.id),
      format: annex.format,
      description: annex.description ?? "",
      source: annex.source ?? "",
      subjects: keepUnique(
        annexLos.flatMap((id) => losById.get(id)?.subject ?? []),
      ),
      learningObjectives: annexLos,
      questions: annexQuestions.map((question) => question.id),
      docs: annexDocs.map((doc) => doc.id),
    };
  });

  return { subjects, learningObjectives, docs, questions, annexes };
};
