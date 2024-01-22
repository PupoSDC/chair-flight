import type {
  LearningObjectiveId,
  QuestionBankCourse,
  QuestionBankFlashcardCollection,
  QuestionBankLearningObjective,
  QuestionBankAnnexes,
  QuestionBankQuestionTemplate,
  QuestionBankSubject,
  SubjectId,
} from "@chair-flight/base/types";

export const connectQuestionBank = ({
  questions,
  learningObjectives,
  subjects,
  annexes,
}: {
  questions: QuestionBankQuestionTemplate[];
  learningObjectives: QuestionBankLearningObjective[];
  courses: QuestionBankCourse[];
  subjects: QuestionBankSubject[];
  annexes: QuestionBankAnnexes[];
  flashcards: QuestionBankFlashcardCollection[];
}) => {
  const learningObjectivesMap = learningObjectives.reduce(
    (sum, lo) => {
      sum[lo.id] = lo;
      return sum;
    },
    {} as Record<LearningObjectiveId, QuestionBankLearningObjective>,
  );

  const subjectsMap = subjects.reduce(
    (sum, lo) => {
      sum[lo.id] = lo;
      return sum;
    },
    {} as Record<SubjectId, QuestionBankSubject>,
  );

  const learningObjectiveToSubject = learningObjectives.reduce(
    (sum, lo) => {
      let parentId: string = lo.parentId;
      while (true) {
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
          `Lo to Subject mapping entered an infinite loop. LO = ${lo.id}, parentId = ${parentId}`
        );
      }


      return sum;
    },
    {} as Record<LearningObjectiveId, SubjectId>,
  )

  // Connect questions to annexes
  questions.forEach((q) => {
    Object.values(q.variants).forEach((v) => {
      v.annexes.forEach((a) => {
        const annex = a.split("/").pop()?.split(".")[0] ?? "";
        const thisMedia = annexes.find((m) => m.id === annex);
        if (thisMedia) {
          thisMedia.questions = [...new Set([...thisMedia.questions, q.id])];
          thisMedia.variants = [...new Set([...thisMedia.variants, v.id])];
          thisMedia.learningObjectives = [
            ...new Set([
              ...thisMedia.learningObjectives,
              ...q.learningObjectives,
            ]),
          ];
        }
      });
    });
  });

  // Connect subjects with annexes
  annexes.forEach((a) => {
    a.subjects = [...new Set(
      a.learningObjectives
        .map((v) => learningObjectiveToSubject[v])
        .filter(Boolean)
    )];
  })

  // Connect learning objectives to questions
  questions.forEach((q) => {
    q.learningObjectives.forEach((lo) => {
      if (!learningObjectivesMap[lo]) return;
      learningObjectivesMap[lo].questions = [
        ...new Set([...learningObjectivesMap[lo].questions, q.id]),
      ];
      learningObjectivesMap[lo].nestedQuestions =
        learningObjectivesMap[lo].questions;
    });
  });

  // Bubble up learning Objectives
  [...learningObjectives].reverse().forEach((lo) => {
    const parent = learningObjectivesMap[lo.parentId];
    if (!parent) return;

    parent.courses = [...new Set([...parent.courses, ...lo.courses])];
    parent.nestedQuestions = [
      ...new Set([...parent.nestedQuestions, ...lo.nestedQuestions]),
    ];
  });

  // Bubble up to subjects
  subjects.forEach((s) => {
    s.learningObjectives.forEach((loId) => {
      const lo = learningObjectivesMap[loId];
      s.numberOfQuestions += lo.nestedQuestions.length + lo.questions.length;
    });
  });

  // Count all question in a Subject
  subjects.forEach((s) => {
    s.numberOfQuestions = s.learningObjectives.reduce(
      (s, lo) => s + learningObjectivesMap[lo]?.nestedQuestions?.length ?? 0,
      0,
    );
  });
};
