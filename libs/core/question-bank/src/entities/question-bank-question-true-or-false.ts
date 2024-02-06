import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type { IsEqual } from "@chair-flight/base/utils";

export type QuestionVariantTrueOrFalse = {
  type: "true-or-false";
  question: string;
  answer: boolean;
};

export const questionVariantTrueOrFalseSchema = z.object({
  type: z.literal("true-or-false"),
  question: z.string().min(3),
  answer: z.boolean(),
});

type IVariantTorF = z.infer<typeof questionVariantTrueOrFalseSchema>;
assertType<IsEqual<IVariantTorF, QuestionVariantTrueOrFalse>>();
