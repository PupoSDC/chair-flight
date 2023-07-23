import { initTRPC } from '@trpc/server';
import { Context } from './context';
 
const trpc = initTRPC.context<Context>().create();
 
export const router = trpc.router;
export const middleware = trpc.middleware;
export const publicProcedure = trpc.procedure;