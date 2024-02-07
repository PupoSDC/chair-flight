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
        question: "",
        options: [1, 2, 3, 4].map((i) => ({
          id: getRandomId(),
          text: "",
          correct: i === 1,
          why: "",
        })),
      };
    case "one-two":
      return {
        type: "one-two",
        question: "",
        firstCorrectStatements: [""],
        secondCorrectStatements: [""],
        firstIncorrectStatements: [""],
        secondIncorrectStatements: [""],
      };
    case "true-or-false":
      return {
        type: "true-or-false",
        question: "",
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
