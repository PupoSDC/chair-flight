import { keepUnique, makeMap } from "@cf/base/utils";
import {
  questionBankValidation,
  type Annex,
  type Course,
  type Doc,
  type LearningObjective,
  type QuestionBankName,
  type QuestionTemplate,
  type Subject,
} from "@cf/core/question-bank";
import type {
  AnnexJson,
  CourseJson,
  DocJson,
  LearningObjectiveJson,
  QuestionTemplateJson,
  SubjectJson,
} from "./json-types";

export const connectQuestionBank = ({
  jsonQuestionTemplates: jsonQuestions,
  jsonLearningObjectives: jsonLos,
  jsonCourses,
  jsonSubjects,
  jsonAnnexes,
  jsonDocs,
  questionBank,
}: {
  jsonQuestionTemplates: QuestionTemplateJson[];
  jsonLearningObjectives: LearningObjectiveJson[];
  jsonCourses: CourseJson[];
  jsonSubjects: SubjectJson[];
  jsonAnnexes: AnnexJson[];
  jsonDocs: DocJson[];
  questionBank: QuestionBankName;
}): {
  questionTemplates: QuestionTemplate[];
  learningObjectives: LearningObjective[];
  courses: Course[];
  subjects: Subject[];
  annexes: Annex[];
  docs: Doc[];
} => {
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
    href: `/content/${questionBank}/media/${a.id}.${a.format}`,
    srcLocation: undefined as unknown as string,
    doc: undefined as unknown as string,
    questions: [],
    subjects: [],
    learningObjectives: [],
  }));

  const docs = jsonDocs.map<Doc>((doc) => ({
    ...doc,
    questionBank,
    subject: undefined,
    learningObjectives: [],
    docs: [],
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

  // Link learning objectives to one another:
  learningObjectives.forEach((lo) => {
    if (!lo.parentId) return;
    const parent = losMap[lo.parentId];
    if (!parent) throw new Error("Missing parent for lo " + lo.id);
    parent.learningObjectives.push(lo.id);
  });

  // Link learning Objectives to Docs
  learningObjectives.forEach((lo) => {
    let docId: string | undefined = lo.id;
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

  // link questions to learning objectives
  questionTemplates.forEach((q) => {
    q.learningObjectives.forEach((lo) => {
      if (!losMap[lo]) return;
      const thisLo = losMap[lo];
      (thisLo.questions = keepUnique([...thisLo.questions, q.id])),
        (thisLo.nestedQuestions = thisLo.questions);
    });
  });

  // Link questions to docs
  questionTemplates.forEach((q) => {
    const docLo = q.learningObjectives.reduce(
      (res, cur) => (cur.length < res.length ? cur : res),
      q.learningObjectives[0],
    );
    const docId = losMap[docLo].doc;
    const doc = docsMap[docId];
    q.doc = doc.id;
    q.srcLocation = doc.fileName.replace("page.md", "questions.json");
  });

  // Link questions to annexes
  questionTemplates.forEach((q) => {
    q.annexes.forEach((annexId) => {
      const annex = annexesMap[annexId];
      annex.questions.push(q.id);
      annex.learningObjectives = keepUnique([
        ...annex.learningObjectives,
        ...q.learningObjectives,
      ]);
    });
  });

  // Link annexes to docs
  annexes.forEach((annex) => {
    const docLo = annex.learningObjectives.reduce(
      (res, cur) => (cur.length < res.length ? cur : res),
      annex.learningObjectives[0],
    );
    const docId = losMap[docLo].doc;
    const doc = docsMap[docId];
    annex.doc = doc.id;
    annex.srcLocation = doc.fileName.replace("page.md", "annexes.json");
  });

  // Link docs to one another
  docs.forEach((doc) => {
    doc.subject = losMap[doc.id]?.subject ?? undefined;
    if (!doc.parentId) return;
    const parent = docsMap[doc.parentId];
    if (!parent) throw new Error("Missing parent for doc " + doc.id);
    parent.docs.push(doc.id);
  });

  // Add Subject to questions
  questionTemplates.map((question) => {
    question.subjects = keepUnique(
      question.learningObjectives.map((lo) => losMap[lo].subject),
    ).filter(Boolean);
  });

  // Add Subject to annexes
  annexes.map((annex) => {
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

  questionBankValidation.parse({
    questionTemplates,
    docs,
    annexes,
    learningObjectives,
    subjects,
    courses,
  });

  return {
    questionTemplates,
    learningObjectives,
    courses: jsonCourses,
    subjects,
    annexes,
    docs,
  };
};
