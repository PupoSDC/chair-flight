import { assertType, IsEqual } from "@chair-flight/base/utils";
import { z } from "zod";
import { QuestionBankName, QuestionBankResource } from "../types";

export const questionBankNameSchema = z.enum(["type", "atpl", "prep"]);

export const questionBankResourceSchema = z.enum([
  "questions",
  "learningObjectives",
  "annexes",
  "flashcards",
  "courses",
  "subjects",
  "docs",
]);

type InferredQuestionBankName = z.infer<typeof questionBankNameSchema>;
type InferredQuestionBankResource = z.infer<typeof questionBankResourceSchema>;
assertType<IsEqual<QuestionBankName, InferredQuestionBankName>>();
assertType<IsEqual<QuestionBankResource, InferredQuestionBankResource>>();
