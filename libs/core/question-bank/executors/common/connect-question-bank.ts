import { makeMap } from "@chair-flight/base/utils";
import { Annex, Course, Doc, LearningObjective, LearningObjectiveId, QuestionTemplate, Subject, SubjectId } from "../../src/types";
import { DocId } from "@chair-flight/base/types";

export const connectQuestionBank = ({
  questionTemplates,
  learningObjectives,
  subjects,
  courses,
  annexes,
  docs,
}: {
  questionTemplates: QuestionTemplate[];
  learningObjectives: LearningObjective[];
  courses: Course[]
  subjects: Subject[];
  annexes: Annex[];
  docs: Doc[];
}) => {
  const learningObjectivesMap = makeMap(learningObjectives, (lo) => lo.id);
  const subjectsMap = makeMap(subjects, (s) => s.id);
  const docsMap = makeMap(docs, (d) => d.id);

  const learningObjectiveToSubject = learningObjectives.reduce(
    (sum, lo) => {
      let parentId: string = lo.parentId;
      while (parentId) {
        const subject = subjectsMap[parentId];
        const parentLo = learningObjectivesMap[parentId];
        if (subject) {
          sum[lo.id] = subject.id;
          break;
        }
        if (parentLo) {
          parentId = parentLo.parentId;
          continue;
        }
        throw new Error(
          `Lo to Subject mapping entered an infinite loop. LO = ${lo.id}, parentId = ${parentId}`,
        );
      }

      return sum;
    },
    {} as Record<LearningObjectiveId, SubjectId>,
  );

  const learningObjectivesToDoc = learningObjectives.reduce(
    (sum, lo) => {
      let parentId: string = lo.id;
      while (parentId) {
        const doc = docsMap[parentId];
        const parentLo = learningObjectivesMap[parentId];
        if (doc) {
          sum[lo.id] = doc.id;
          break;
        }
        if (parentLo) {
          parentId = parentLo.parentId;
          continue;
        }
        throw new Error(
          `Lo to Doc mapping entered an infinite loop. LO = ${lo.id}, parentId = ${parentId}`,
        );
      }

      return sum;
    },
    {} as Record<LearningObjectiveId, DocId>,
  );

  questionTemplates.forEach((q) => {

    // Connect Annexes to Questions, Los, and Subjects
    q.annexes.forEach((a) => {
      const annex = a.split("/").pop()?.split(".")[0] ?? "";
      const thisAnnex = annexes.find((m) => m.id === annex) as Annex;
      if (thisAnnex) {
        thisAnnex.questions ??= [];
        thisAnnex.questions = [
          ...new Set([...thisAnnex.questions, q.id])
        ];

        thisAnnex.learningObjectives ??= [];
        thisAnnex.learningObjectives = [
          ...new Set([
            ...thisAnnex.learningObjectives,
            ...q.learningObjectives,
          ]),
        ];

        thisAnnex.subjects ??= [];
        thisAnnex.subjects = [
          ...new Set(
            thisAnnex.learningObjectives
              .map((v) => learningObjectiveToSubject[v])
              .filter(Boolean),
          ),
        ];
      }
    });

    // Connect learning objective to question
    q.learningObjectives.forEach((lo) => {
      if (!learningObjectivesMap[lo]) return;
      const thisLo = learningObjectivesMap[lo];
      thisLo.questions ??= [];
      thisLo.questions = [...new Set([...thisLo.questions, q.id]),];
      thisLo.nestedQuestions = thisLo.questions;
    });

    // Connect question to subject
    q.subjects = [...new Set([
      ...q.learningObjectives.map((lo) => learningObjectiveToSubject[lo])
    ])];

    q.docId = learningObjectivesToDoc[q.learningObjectives[0]] ?? "";

    // Connect question to doc
    if (q.docId) {
      const doc = docsMap[q.docId];
      doc.questions ??= [];
      doc.questions = [...new Set([...doc.questions, q.id])];
    }
  });

  // Bubble up learning Objectives questions and courses
  [...learningObjectives].reverse().forEach((lo) => {
    const thisLo = lo;
    const loParent = learningObjectivesMap[lo.parentId];
    const subjectParent = subjectsMap[lo.parentId];
    if (loParent) {
      loParent.courses = [
        ...new Set([...loParent.courses, ...lo.courses])
      ];
      loParent.nestedQuestions = [
        ...new Set([...loParent.nestedQuestions, ...thisLo.nestedQuestions]),
      ];
      return;
    }
    if (subjectParent) {
      subjectParent.courses = [
        ...new Set([...subjectParent.courses, ...lo.courses])
      ];
      subjectParent.learningObjectives = [
        ...new Set([...subjectParent.learningObjectives, thisLo.id])
      ];
      subjectParent.numberOfQuestions += thisLo.nestedQuestions?.length ?? 0;
      return;
    }
  });    

  // Connect docs
  [...docs].reverse().forEach((d) => {
    if (!d.parent) return;
    docsMap[d.parent].children.push(d.id);
  });

  // Connect docs to Subjects
  docs.forEach((doc) => {
    doc.subject = (doc.id.split(".").length === 1) 
      ? doc.id 
      : learningObjectiveToSubject[doc.id];
  });
};
