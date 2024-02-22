import { initTRPC } from "@trpc/server";
import { default as superJson } from "superjson";

const trpc = initTRPC.create({ transformer: superJson });

export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;
