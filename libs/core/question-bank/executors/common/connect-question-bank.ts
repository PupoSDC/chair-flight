import {
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
  courses,
  subjects,
  media,
  flashcards,
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
  learningObjectives.forEach((lo) => {
    learningObjectives.forEach((lo2) => {
      if (lo2.id.startsWith(lo.id)) {
        lo.courses = [...new Set([...lo.courses, ...lo2.courses])];
        lo.nestedQuestions = [...new Set([...lo.questions, ...lo2.questions])];
      }
    });
  });
};

/**
  (acc, lo) => {
    const path = lo.id
      .split(".")
      .map((_, index, arr) => arr.slice(0, index + 1).join("."));

    const subject = acc.find((s) => {
      const key = path[0] === "071" ? "070" : path[0];
      return s.id === key;
    });

    const chapter = subject?.children?.find((c) => path[1].startsWith(c.id));
    const section = chapter?.children?.find((s) => path[2].startsWith(s.id));

    if (!subject || path.length === 1) return acc;

    if (path.length === 2) {
      subject.numberOfQuestions += lo.questions.length;
      subject.children ??= [];
      subject.children.push({
        id: lo.id,
        text: lo.text,
        numberOfQuestions: lo.questions.length,
        numberOfLearningObjectives: 0,
        children: [],
      });
      return acc;
    }

    if (!chapter) throw new Error(`Chapter not found: ${path[1]}`);
    if (path.length === 3) {
      subject.numberOfQuestions += lo.questions.length;
      chapter.numberOfQuestions += lo.questions.length;
      chapter.children ??= [];
      chapter.children.push({
        id: lo.id,
        text: lo.text,
        numberOfQuestions: lo.questions.length,
        numberOfLearningObjectives: 0,
        children: [],
      });
      return acc;
    }

    if (!section) throw new Error(`Section not found: ${path[2]}`);

    subject.numberOfLearningObjectives += 1;
    chapter.numberOfLearningObjectives += 1;
    section.numberOfLearningObjectives += 1;

    subject.numberOfQuestions += lo.questions.length;
    chapter.numberOfQuestions += lo.questions.length;
    section.numberOfQuestions += lo.questions.length;

    return acc;
  },
*/
