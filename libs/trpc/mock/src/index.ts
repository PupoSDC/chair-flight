import { createTRPCMsw } from "msw-trpc";
import type { AppRouter } from "@chair-flight/trpc/server";

export const trpcMsw = createTRPCMsw<AppRouter>();
