import { createTRPCMsw } from "msw-trpc";
import { default as superJson } from "superjson";
import type { AppRouter } from "@chair-flight/trpc/server";

export const trpcMsw = createTRPCMsw<AppRouter>({
  transformer: {
    input: superJson,
    output: superJson,
  },
});

export * from "./__mocks__/flashcards.mock";
export * from "./__mocks__/tests-get-subjects.mock";
export * from "./__mocks__/tests-create-test.mock";
export * from "./__mocks__/question-bank-get-question.mock";
export * from "./__mocks__/question-bank-question-search-search-questions.mock";
export * from "./__mocks__/question-bank-lo-search-search-learning-objectives.mock";
export * from "./__mocks__/question-bank-question-search-get-questions-from-learning-objectives.mock";
export * from "./__mocks__/question-bank-get-all-subjects.mock";
