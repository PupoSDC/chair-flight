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
export * from "./__mocks__/question-bank-annex-search-get-search-config-filters.mock";
export * from "./__mocks__/question-bank-annex-search-search-annexes.mock";
export * from "./__mocks__/question-bank-lo-search-get-search-config.mock";
export * from "./__mocks__/question-bank-lo-search-search-learning-objectives.mock";
export * from "./__mocks__/question-bank-question-search-get-questions-from-learning-objectives.mock";
export * from "./__mocks__/question-bank-question-search-get-search-config-filters.mock";
export * from "./__mocks__/question-bank-question-search-search-questions.mock";
export * from "./__mocks__/question-bank-questions-get-question-from-github";
export * from "./__mocks__/question-bank-questions-get-question.mock";
export * from "./__mocks__/tests-create-test.mock";
export * from "./__mocks__/tests-get-subjects.mock";
