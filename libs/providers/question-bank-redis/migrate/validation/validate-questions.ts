import { z } from "zod";
import { questionSchema } from "@chair-flight/core/schemas";
import type { QuestionTemplate } from "@chair-flight/base/types";

const questionTemplateArraySchema = z.array(questionSchema);

export const validateQuestions = (questions: QuestionTemplate[]): void => {
  questionTemplateArraySchema.parse(questions);
};
