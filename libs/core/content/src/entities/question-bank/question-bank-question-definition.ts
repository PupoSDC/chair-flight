import { z } from "zod";

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

export type QuestionVariantDefinition = z.infer<
  typeof questionVariantDefinitionSchema
>;
