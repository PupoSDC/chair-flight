import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@cf/providers/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc2",
    router: appRouter,
    req,
    createContext: async () => ({}),
  });

export const POST = handler;
export const GET = handler;
