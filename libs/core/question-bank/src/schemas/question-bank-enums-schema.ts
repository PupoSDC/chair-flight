import { z } from "zod";
import type { IsEqual } from "@chair-flight/base/utils";
import { assertType } from "@chair-flight/base/utils";
import type { QuestionBankName, QuestionBankResource } from "../types";

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
