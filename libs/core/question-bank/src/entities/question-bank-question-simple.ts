import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type { QuestionOptionId } from "./ids";
import type { IsEqual } from "@chair-flight/base/utils";

export type QuestionVariantSimple = {
  type: "simple";
  question: string;
  options: Array<{
    id: QuestionOptionId;
    text: string;
    correct: boolean;
    why: string;
  }>;
};

export const questionVariantSimpleSchema = z.object({
  type: z.literal("simple"),
  question: z.string().min(3),
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1),
        correct: z.boolean(),
        why: z.string(),
      }),
    )
    .min(4)
    .superRefine((data, ctx) => {
      const correct = data.filter((d) => d.correct).length;
      const wrong = data.filter((d) => !d.correct).length;
      if (correct < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 1,
          type: "array",
          inclusive: true,
          message: "At least one correct answer must exist!",
        });
      }
      if (wrong < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_small,
          minimum: 3,
          type: "array",
          inclusive: true,
          message: "At least 3 wrong answers must exist!",
        });
      }
    }),
});

type IVariantSimple = z.infer<typeof questionVariantSimpleSchema>;
assertType<IsEqual<IVariantSimple, QuestionVariantSimple>>();
