import { getRandomId } from "@chair-flight/base/utils";
import type {
  QuestionVariant,
  QuestionVariantType,
} from "../entities/question-bank-question";

export const getNewVariant = (type: QuestionVariantType): QuestionVariant => {
  const common = {
    type,
    id: getRandomId(),
    annexes: [] as string[],
    externalIds: [] as string[],
    explanation: "",
  };

  switch (type) {
    case "simple":
      return {
        ...common,
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
        ...common,
        type: "one-two",
        question: "",
        firstCorrectStatements: [""],
        secondCorrectStatements: [""],
        firstIncorrectStatements: [""],
        secondIncorrectStatements: [""],
      };
    case "true-or-false":
      return {
        ...common,
        type: "true-or-false",
        question: "",
        answer: true,
      };
    case "definition":
      return {
        ...common,
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
        ...common,
        options: [1, 2, 3, 4].map((i) => ({
          text: "",
          correct: i === 1,
          why: "",
        })),
        type: "multiple-correct",
        question: "",
      };
  }
};
