import { createTRPCMsw } from "msw-trpc";
import { default as superJson } from "superjson";
import type { AppRouter } from "@chair-flight/trpc/server";

export const trpcMsw = createTRPCMsw<AppRouter>({
  transformer: {
    input: superJson,
    output: superJson,
  },
});

export { mockSubjects } from "./__mocks__/subjects.mock";
export { mockTest } from "./__mocks__/test.mock";
export { mockQuestion } from "./__mocks__/question.mock";
export { mockQuestionSearchItems } from "./__mocks__/question-search.mock";
