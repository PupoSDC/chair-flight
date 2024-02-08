import { getRandomId } from "@chair-flight/base/utils";
import type {
  QuestionVariant,
  QuestionVariantType,
} from "../entities/question-bank-question";

export const getNewVariant = (type: QuestionVariantType): QuestionVariant => {
  switch (type) {
    case "simple":
      return {
        type: "simple",
        question: "What Option is Correct?",
        options: [1, 2, 3, 4].map((i) => ({
          id: getRandomId(),
          text: `Option ${i}`,
          correct: i === 1,
          why: "",
        })),
      };
    case "one-two":
      return {
        type: "one-two",
        question: "Which Statements are correct?",
        firstCorrectStatements: ["A correct statement"],
        secondCorrectStatements: ["A Second correct Statement"],
        firstIncorrectStatements: ["A Wrong Statement"],
        secondIncorrectStatements: ["Another Wrong Statement"],
      };
    case "true-or-false":
      return {
        type: "true-or-false",
        question: "The Sky is Blue?",
        answer: true,
      };
    case "definition":
      return {
        type: "definition",
        question: "${term}...",
        fakeOptions: [],
        options: [1, 2, 3, 4].map(() => ({
          id: getRandomId(),
          term: "",
          definition: "",
        })),
      };
    case "multiple-correct":
      return {
        type: "multiple-correct",
        options: [1, 2, 3, 4].map((i) => ({
          text: "",
          correct: i === 1,
          why: "",
        })),
        question: "",
      };
  }
};
