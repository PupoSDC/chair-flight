import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type { QuestionOptionId } from "./ids";
import type { IsEqual } from "@chair-flight/base/utils";

export type QuestionVariantDefinition = {
  type: "definition";
  question: string;
  options: Array<{
    id: QuestionOptionId;
    term: string;
    definition: string;
  }>;
  fakeOptions: Array<{
    id: QuestionOptionId;
    definition: string;
  }>;
};

export const questionVariantDefinitionSchema = z
  .object({
    type: z.literal("definition"),
    question: z.string().min(3),
    options: z
      .array(
        z.object({
          id: z.string(),
          term: z.string().min(1),
          definition: z.string().min(1),
        }),
      )
      .min(2),
    fakeOptions: z.array(
      z.object({
        id: z.string(),
        definition: z.string().min(1),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const totalLength = data.options.length + data.fakeOptions.length;
    if (totalLength < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_small,
        minimum: 1,
        type: "array",
        inclusive: true,
        message: "The Correct and Fake options sum must be more than 4!",
      });
    }
  });

type IVariantDefinition = z.infer<typeof questionVariantDefinitionSchema>;
assertType<IsEqual<IVariantDefinition, QuestionVariantDefinition>>();
