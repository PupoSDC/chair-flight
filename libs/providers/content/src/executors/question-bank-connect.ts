import { keepUnique, makeMap } from "@cf/base/utils";
import {
  questionBankSchema,
  type Annex,
  type Course,
  type Doc,
  type LearningObjective,
  type QuestionBankName,
  type QuestionTemplate,
  type Subject,
} from "@cf/core/content";
import type { MediaMap } from "../providers/content";
import type {
  AnnexJson,
  CourseJson,
  DocJson,
  LearningObjectiveJson,
  QuestionTemplateJson,
  SubjectJson,
} from "./question-bank-json-schemas";
import type { FlashcardCollection } from "@cf/core/content";

const ANNEX_MATCH = /!\[.*\]\(annex:(.*)\)/gm;

export const connectQuestionBank = ({
  jsonQuestionTemplates: jsonQuestions,
  jsonLearningObjectives: jsonLos,
  jsonCourses,
  jsonSubjects,
  jsonAnnexes,
  jsonDocs,
  jsonFlashcardCollections,
  questionBank,
  mediaMap,
}: {
  jsonQuestionTemplates: QuestionTemplateJson[];
  jsonLearningObjectives: LearningObjectiveJson[];
  jsonCourses: CourseJson[];
  jsonSubjects: SubjectJson[];
  jsonAnnexes: AnnexJson[];
  jsonFlashcardCollections: FlashcardCollection[];
  jsonDocs: DocJson[];
  questionBank: QuestionBankName;
  mediaMap: MediaMap;
}): {
  questionTemplates: QuestionTemplate[];
  learningObjectives: LearningObjective[];
  courses: Course[];
  subjects: Subject[];
  annexes: Annex[];
  docs: Doc[];
  flashcardCollections: FlashcardCollection[];
} => {
  const flashcardCollections = jsonFlashcardCollections;
  const courses = jsonCourses;

  const learningObjectives = jsonLos.map<LearningObjective>((lo) => ({
    ...lo,
    questionBank,
    doc: undefined as unknown as string,
    questions: [],
    learningObjectives: [],
    nestedQuestions: [],
  }));

  const questionTemplates = jsonQuestions.map<QuestionTemplate>((q) => ({
    ...q,
    questionBank,
    doc: undefined as unknown as string,
    srcLocation: undefined as unknown as string,
    subjects: [],
  }));

  const annexes = jsonAnnexes.map<Annex>((a) => ({
    ...a,
    questionBank: questionBank,
    href: mediaMap[a.id] ?? "/placeholder.png",
    srcLocation: undefined as unknown as string,
    docs: [],
    questions: [],
    subjects: [],
    learningObjectives: [],
  }));

  const docs = jsonDocs.map<Doc>((doc) => ({
    ...doc,
    rootDocId: "",
    questionBank,
    subject: undefined,
    learningObjectives: [],
    docs: [],
    nestedDocs: [],
    empty: !doc.content,
  }));

  const subjects = jsonSubjects.map<Subject>((subject) => ({
    ...subject,
    courses: [],
    nestedLearningObjectives: [],
    numberOfQuestions: 0,
  }));

  const losMap = makeMap(learningObjectives, (lo) => lo.id);
  const docsMap = makeMap(docs, (d) => d.id);
  const subjectsMap = makeMap(subjects, (s) => s.id);
  const annexesMap = makeMap(annexes, (a) => a.id);

  learningObjectives.forEach(function linkLearningObjectivesToOneAnother(lo) {
    if (!lo.parentId) return;
    const parent = losMap[lo.parentId];
    if (!parent) throw new Error("Missing parent for lo " + lo.id);
    parent.learningObjectives.push(lo.id);
  });

  learningObjectives.forEach(function linkLearningObjectivesToDocs(lo) {
    let docId: string | null = lo.id;
    while (docId) {
      if (docsMap[docId]) {
        lo.doc = docId;
        docsMap[docId].learningObjectives.push(lo.id);
        return;
      } else {
        docId = losMap[docId].parentId;
      }
    }
    throw new Error(`Unable to connect lo ${lo.id} to a doc!`);
  });

  questionTemplates.forEach(function linkQuestionsToLearningObjectives(q) {
    q.learningObjectives.forEach((lo) => {
      if (!losMap[lo]) return;
      const thisLo = losMap[lo];
      (thisLo.questions = keepUnique([...thisLo.questions, q.id])),
        (thisLo.nestedQuestions = thisLo.questions);
    });
  });

  questionTemplates.forEach(function linkQuestionsToDocs(q) {
    const docLo = q.learningObjectives.reduce(
      (res, cur) => (cur.length < res.length ? cur : res),
      q.learningObjectives[0],
    );
    const docId = losMap[docLo].doc;
    const doc = docsMap[docId];
    q.doc = doc.id;
    q.srcLocation = doc.fileName.replace("page.md", "questions.yaml");
  });

  questionTemplates.forEach(function linkQuestionsToAnnexes(q) {
    q.annexes.forEach((annexId) => {
      const annex = annexesMap[annexId];
      annex.questions.push(q.id);
      annex.learningObjectives = keepUnique([
        ...annex.learningObjectives,
        ...q.learningObjectives,
      ]);
    });

    keepUnique(
      Array.from(q.explanation.matchAll(ANNEX_MATCH), (m) => m[1]),
    ).forEach((annexId) => {
      const annex = annexesMap[annexId];
      if (!annex)
        throw new Error(
          "Missing annex " + annexId + " in question Explanation " + q.id,
        );
      annex.questions = keepUnique([...annex.docs, q.id]);
      annex.learningObjectives = keepUnique([
        ...annex.learningObjectives,
        ...q.learningObjectives,
      ]);
      q.explanation = q.explanation.replaceAll(ANNEX_MATCH, (match, cg1) =>
        match.replace(
          `annex:${annexId}`,
          `/content/${questionBank}/media/${cg1}.${annex.format}`,
        ),
      );
    });
  });

  // TODO: Replace docs annexes with URLs
  docs.forEach(function linkDocsToAnnexes(doc) {
    keepUnique(
      Array.from(doc.content.matchAll(ANNEX_MATCH), (m) => m[1]),
    ).forEach((annexId) => {
      const annex = annexesMap[annexId];
      if (!annex)
        throw new Error("Missing annex " + annexId + " in doc " + doc.id);
      annex.docs = keepUnique([...annex.docs, doc.id]);
      annex.learningObjectives = keepUnique([
        ...annex.learningObjectives,
        ...doc.learningObjectives,
      ]);
      doc.content = doc.content.replaceAll(ANNEX_MATCH, (match, cg1) =>
        match.replace(
          `annex:${annexId}`,
          `/content/${questionBank}/media/${cg1}.${annex.format}`,
        ),
      );
    });
  });

  annexes.forEach(function determineAnnexSourceLocation(annex) {
    const docLo = annex.learningObjectives.reduce(
      (res, cur) => (cur.length < res.length ? cur : res),
      annex.learningObjectives[0],
    );
    const docId = losMap[docLo].doc;
    const doc = docsMap[docId];
    annex.srcLocation = doc.fileName.replace("page.md", "annexes.yaml");
  });

  docs.forEach(function linkDocsToOneAnother(doc) {
    doc.subject = losMap[doc.id]?.subject ?? undefined;
    if (!doc.parentId) {
      doc.rootDocId = doc.id;
      doc.rootDocToc = docs
        .filter((d) => d.parentId === doc.id)
        .map((d) => ({
          id: d.id,
          title: d.title,
          nestedDocs: docs
            .filter((e) => e.id.startsWith(d.id ?? "fail") && e.id !== d.id)
            .map((e) => ({
              id: e.id,
              title: e.title,
            })),
        }));
    } else {
      let tentativeRoot = docsMap[doc.parentId];
      while (tentativeRoot.parentId) {
        tentativeRoot = docsMap[tentativeRoot.parentId];
      }
      doc.rootDocId = tentativeRoot.id;
    }
  });

  questionTemplates.map(function addSubjectToQuestions(question) {
    question.subjects = keepUnique(
      question.learningObjectives.map((lo) => losMap[lo].subject),
    ).filter(Boolean);
  });

  annexes.map(function addSubjectToAnnexes(annex) {
    annex.subjects = keepUnique(
      annex.learningObjectives.map((lo) => losMap[lo].subject),
    ).filter(Boolean);
  });

  // bubble up questions inside learning objectives and subjects
  [...learningObjectives].reverse().forEach((lo) => {
    if (lo.parentId) {
      const thisLo = lo;
      const loParent = losMap[lo.parentId];
      loParent.courses = keepUnique([...loParent.courses, ...lo.courses]);
      loParent.nestedQuestions = keepUnique([
        ...loParent.nestedQuestions,
        ...thisLo.nestedQuestions,
      ]);
      return;
    }

    if (lo.subject) {
      const subject = subjectsMap[lo.subject];
      subject.numberOfQuestions += lo.questions.length ?? 0;
      subject.courses = [...new Set([...subject.courses, ...lo.courses])];
      subject.nestedLearningObjectives = [
        ...new Set([...subject.nestedLearningObjectives, lo.id]),
      ];
      return;
    }
  });

  return questionBankSchema.parse({
    questionTemplates,
    docs,
    annexes,
    learningObjectives,
    subjects,
    courses,
    flashcardCollections,
  });
};
