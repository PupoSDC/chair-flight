import { z } from "zod";
import { assertType } from "@chair-flight/base/utils";
import type {
  QuestionTemplate,
  QuestionVariantDefinition,
  QuestionVariantMultipleCorrect,
  QuestionVariantOneTwo,
  QuestionVariantSimple,
  QuestionVariantTrueOrFalse,
} from "../types/question-bank-types";
import type { IsEqual } from "@chair-flight/base/utils";

export const questionVariantSimpleSchema = z.object({
  type: z.literal("simple"),
  question: z.string().min(3),
  options: z
    .object({
      id: z.string(),
      text: z.string().min(1),
      correct: z.boolean(),
      why: z.string(),
    })
    .array()
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

export const questionVariantTrueOrFalseSchema = z.object({
  type: z.literal("true-or-false"),
  question: z.string().min(3),
  answer: z.boolean(),
});

type IVariantTorF = z.infer<typeof questionVariantTrueOrFalseSchema>;
assertType<IsEqual<IVariantTorF, QuestionVariantTrueOrFalse>>();

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

export const questionTemplateSchema = z.object({
  id: z.string(),
  doc: z.string(),
  relatedQuestions: z.array(z.string()),
  externalIds: z.string().array(),
  subjects: z.array(z.string()).min(1),
  annexes: z.string().array(),
  learningObjectives: z.array(z.string()).min(1),
  explanation: z.string(),
  srcLocation: z.string().min(6),
  variant: z.union([
    questionVariantSimpleSchema,
    questionVariantDefinitionSchema,
    questionVariantTrueOrFalseSchema,
    questionVariantMultipleCorrectSchema,
    questionVariantOneTwoSchema,
  ]),
});

type IQuestionTemplate = z.infer<typeof questionTemplateSchema>;
assertType<IsEqual<IQuestionTemplate, QuestionTemplate>>();
