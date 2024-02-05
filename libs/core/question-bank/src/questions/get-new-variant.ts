import { UnimplementedError } from "@chair-flight/base/errors";
import { getRandomId } from "@chair-flight/base/utils";
import type { QuestionVariant, QuestionVariantType } from "../types/question";

export const getNewVariant = (type: QuestionVariantType): QuestionVariant => {
  const common = {
    type,
    id: getRandomId(),
    question: "",
    annexes: [] as string[],
    externalIds: [] as string[],
    explanation: "",
  };

  switch (type) {
    case "simple":
      return {
        ...common,
        type: "simple",
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
        firstCorrectStatements: [""],
        secondCorrectStatements: [""],
        firstIncorrectStatements: [""],
        secondIncorrectStatements: [""],
      };
    default:
      throw new UnimplementedError("Variant is not implemented yet");
  }
};
