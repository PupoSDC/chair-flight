import { initTRPC } from "@trpc/server";

const trpc = initTRPC.create();

export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;
