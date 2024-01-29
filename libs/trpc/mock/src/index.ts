import { createTRPCMsw } from "msw-trpc";
import { default as superJson } from "superjson";
import type { AppRouter } from "@chair-flight/trpc/server";

export const trpcMsw = createTRPCMsw<AppRouter>({
  transformer: {
    input: superJson,
    output: superJson,
  },
});
