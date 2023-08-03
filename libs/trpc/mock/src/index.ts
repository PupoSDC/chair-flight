import { createTRPCMsw } from "msw-trpc";
import type { AppRouter } from "@chair-flight/trpc/server";

export const trpcMsw = createTRPCMsw<AppRouter>();

export { mockSubjects } from "./__mocks__/subjects.mock";
export { mockTest } from "./__mocks__/test.mock";
