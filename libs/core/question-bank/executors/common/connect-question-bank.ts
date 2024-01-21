import type {
  LearningObjectiveId,
  QuestionBankCourse,
  QuestionBankFlashcardCollection,
  QuestionBankLearningObjective,
  QuestionBankMedia,
  QuestionBankQuestionTemplate,
  QuestionBankSubject,
} from "@chair-flight/base/types";

export const connectQuestionBank = ({
  questions,
  learningObjectives,
  subjects,
  media,
}: {
  questions: QuestionBankQuestionTemplate[];
  learningObjectives: QuestionBankLearningObjective[];
  courses: QuestionBankCourse[];
  subjects: QuestionBankSubject[];
  media: QuestionBankMedia[];
  flashcards: QuestionBankFlashcardCollection[];
}) => {
  const learningObjectivesMap = learningObjectives.reduce(
    (sum, lo) => {
      sum[lo.id] = lo;
      return sum;
    },
    {} as Record<LearningObjectiveId, QuestionBankLearningObjective>,
  );

  // Connect questions to media
  questions.forEach((q) => {
    Object.values(q.variants).forEach((v) => {
      v.annexes.forEach((a) => {
        const annex = a.split("/").pop()?.split(".")[0] ?? "";
        const thisMedia = media.find((m) => m.id === annex);
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

  // Connect learning objectives to questions
  questions.forEach((q) => {
    q.learningObjectives.forEach((lo) => {
      if (learningObjectivesMap[lo]) {
        learningObjectivesMap[lo].questions = [
          ...new Set([...learningObjectivesMap[lo].questions, q.id]),
        ];
      }
    });
  });

  // Bubble up learning Objectives
  learningObjectives.reverse().forEach((lo) => {
    lo.learningObjectives.forEach((lo2) => {
      const p = learningObjectivesMap[lo2];
      if (!p) return;
      p.courses = [...new Set([...p.courses, ...lo.courses])];
      p.nestedQuestions = [...new Set([...p.questions, ...lo.questions])];
      p.nestedLearningObjectives = [
        ...p.learningObjectives,
        ...lo.learningObjectives,
      ];
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
