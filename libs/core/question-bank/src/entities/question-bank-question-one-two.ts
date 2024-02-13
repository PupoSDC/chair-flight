import { z } from "zod";
import { assertType } from "@cf/base/utils";
import type { IsEqual } from "@cf/base/utils";

export type QuestionVariantOneTwo = {
  type: "one-two";
  question: string;
  firstCorrectStatements: string[];
  firstIncorrectStatements: string[];
  secondCorrectStatements: string[];
  secondIncorrectStatements: string[];
};

export const questionVariantOneTwoSchema = z.object({
  type: z.literal("one-two"),
  question: z.string().min(3),
  firstCorrectStatements: z.array(z.string().min(3)).min(1),
  firstIncorrectStatements: z.array(z.string().min(3)).min(1),
  secondCorrectStatements: z.array(z.string().min(3)).min(1),
  secondIncorrectStatements: z.array(z.string().min(3)).min(1),
});

type IVariantOneTwo = z.infer<typeof questionVariantOneTwoSchema>;
assertType<IsEqual<IVariantOneTwo, QuestionVariantOneTwo>>();
