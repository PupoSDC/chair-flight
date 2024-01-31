import { z } from "zod";
import { assertType, type IsEqual } from "@chair-flight/base/utils";
import type { BankName, BankResource } from "@chair-flight/base/types";

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
assertType<IsEqual<BankName, InferredQuestionBankName>>();
assertType<IsEqual<BankResource, InferredQuestionBankResource>>();
