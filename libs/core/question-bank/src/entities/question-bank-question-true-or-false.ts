import { z } from "zod";
import { assertType } from "@cf/base/utils";
import type { IsEqual } from "@cf/base/utils";

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
