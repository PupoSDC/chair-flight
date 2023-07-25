import { z } from "zod";
import type { QuestionTemplate } from "@chair-flight/base/types";
import { questionSchema } from "@chair-flight/question-bank/schemas";

const questionTemplateArraySchema = z.array(questionSchema);

export const validateQuestions = (questions: QuestionTemplate[]): void => {
  questionTemplateArraySchema.parse(questions);
};
