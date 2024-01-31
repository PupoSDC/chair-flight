import { z } from "zod";
import { QuestionVariantDefinition } from "@chair-flight/base/types";
import { IsEqual, assertType } from "@chair-flight/base/utils";

const questionDefinitionSchemaRaw = z.object({
  type: z.literal("definition"),
  id: z.string(),
  annexes: z.string().array(),
  externalIds: z.string().array(),

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
});

// Cast the type of super refine to avoid typing issues upstream
export const questionDefinitionSchema = questionDefinitionSchemaRaw.superRefine(
  (data, ctx) => {
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
  },
) as unknown as typeof questionDefinitionSchemaRaw;

type SchemaType = z.infer<typeof questionDefinitionSchema>;
assertType<IsEqual<SchemaType, QuestionVariantDefinition>>();
