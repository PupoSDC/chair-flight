import { getQuestion } from "./get-question";
import type { QuestionBankQuestionTemplate } from "../types/question-bank-question-templates";

describe("getQuestions", () => {
  it("generates a one two idempotent question", () => {
    const questionTemplate: QuestionBankQuestionTemplate = {
      srcLocation: "...",
      id: "QYFPA3CY4E",
      explanation: "Potato.",
      learningObjectives: ["081.01.01.01.13"],
      variants: {
        QYFPA3CY4F: {
          type: "one-two",
          id: "QYFPA3CY4F",
          externalIds: [
            "BGS-810012",
            "ATPLGS-126491",
            "ATPLGS-126495",
            "BGS-810033",
            "BGS-810023",
            "ATPLGS-118462",
            "BGS-810028",
            "BGS-810017",
            "ATPLQ-818483",
            "AVEXAM-9113",
            "ATPLGS-625823",
          ],
          annexes: [],
          question:
            "Considering subsonic incompressible airflow through a Venturi, which statement is correct?",
          firstCorrectStatements: [
            "The dynamic pressure in the throat is higher than in the undisturbed airflow.",
          ],
          firstIncorrectStatements: [
            "The dynamic pressure in the throat is lower than in the undisturbed airflow.",
            "The dynamic pressure in the throat is same than in the undisturbed airflow.",
          ],
          secondCorrectStatements: [
            "The static pressure in the throat is lower than in the undisturbed airflow.",
            "The total pressure in the throat is the same as in the undisturbed airflow.",
          ],
          secondIncorrectStatements: [
            "The static pressure in the throat is higher than in the undisturbed airflow.",
            "The static pressure in the throat is the same than in the undisturbed airflow.",
            "The total pressure in the throat is higher than in the undisturbed airflow.",
            "The total pressure in the throat is lower than in the undisturbed airflow.",
          ],
          explanation: "",
        },
      },
    };
    const questionA = getQuestion(questionTemplate, {
      variantId: "QYFPA3CY4F",
      seed: "some random seed",
    });
    const questionB = getQuestion(questionTemplate, {
      variantId: "QYFPA3CY4F",
      seed: "some random seed",
    });

    expect(questionA).toEqual(questionB);
  });
});
