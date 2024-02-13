import { z } from "zod";
import { assertType } from "@cf/base/utils";
import type { IsEqual } from "@cf/base/utils";

export type QuestionVariantMultipleCorrect = {
  type: "multiple-correct";
  question: string;
  options: Array<{
    text: string;
    correct: boolean;
    why: string;
  }>;
};

export const questionVariantMultipleCorrectSchema = z.object({
  type: z.literal("multiple-correct"),
  question: z.string().min(3),
  options: z
    .object({
      text: z.string().min(1),
      correct: z.boolean(),
      why: z.string(),
    })
    .array()
    .min(4),
});

type IVariantMultiple = z.infer<typeof questionVariantMultipleCorrectSchema>;
assertType<IsEqual<IVariantMultiple, QuestionVariantMultipleCorrect>>();
