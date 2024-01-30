import { QuestionVariantOneTwo } from "@chair-flight/base/types";
import { IsEqual, assertType } from "@chair-flight/base/utils";
import { z } from "zod";

export const questionOneTwoSchema = z.object({
  type: z.literal("one-two"),
  id: z.string(),
  question: z.string().min(3),
  firstCorrectStatements: z.array(z.string().min(3)).min(1),
  firstIncorrectStatements: z.array(z.string().min(3)).min(1),
  secondCorrectStatements: z.array(z.string().min(3)).min(1),
  secondIncorrectStatements: z.array(z.string().min(3)).min(1),
  annexes: z.string().array(),
  externalIds: z.string().array(),
  explanation: z.string(),
});


type SchemaType = z.infer<typeof questionOneTwoSchema>;
assertType<IsEqual<SchemaType, QuestionVariantOneTwo>>();