import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@cf/providers/trpc";

export const GET = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc2",
    router: appRouter,
    req,
    createContext: async () => ({}),
  });
