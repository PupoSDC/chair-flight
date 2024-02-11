import { makeMap } from "@chair-flight/base/utils";
import type {
  Annex,
  Doc,
  QuestionTemplate,
} from "@chair-flight/core/question-bank";

export const arrangeQuestions = ({
  questionTemplates,
  docs,
}: {
  questionTemplates: QuestionTemplate[];
  docs: Doc[];
}) => {
  const questionMap = makeMap(
    docs,
    (doc) => doc.id,
    (doc) => ({
      fileName: doc.fileName.replace("page.md", "questions.json"),
      questions: [] as QuestionTemplate[],
    }),
  );

  return questionTemplates.reduce((sum, question) => {
    if (!sum[question.doc]) {
      throw new Error(`Question ${question.id} has no doc`);
    }

    const cleanQuestion = {
      id: question.id,
      questionBank: question.questionBank ?? "atpl",
      relatedQuestions: question.relatedQuestions.sort(),
      externalIds: question.externalIds.sort(),
      annexes: question.annexes,
      learningObjectives: question.learningObjectives.sort(),
      explanation: question.explanation,
      variant: question.variant,
      doc: question.doc,
      subjects: question.subjects.sort(),
      srcLocation: sum[question.doc].fileName,
    };
    sum[question.doc].questions.push(cleanQuestion);
    return sum;
  }, questionMap);
};

export const arrangeAnnexes = ({
  annexes,
  docs,
}: {
  annexes: Annex[];
  docs: Doc[];
}) => {
  const annexMap = makeMap(
    docs,
    (doc) => doc.id,
    (doc) => ({
      fileName: doc.fileName.replace("page.md", "annexes.json"),
      annexes: [] as Pick<Annex, "id" | "description" | "format">[],
    }),
  );

  return annexes.reduce((sum, annex) => {
    if (!sum[annex.doc]) {
      throw new Error(`Annex ${annex.id} has no doc`);
    }

    const cleanAnnex = {
      id: annex.id,
      questionBank: annex.questionBank ?? "atpl",
      description: annex.description,
      format: annex.format,
    };

    sum[annex.doc].annexes.push(cleanAnnex);
    return sum;
  }, annexMap);
};
