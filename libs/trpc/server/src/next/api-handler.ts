import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../config/app-router";
import { createContext } from "../config/context";
import type { NextRequest } from "next/server";

export const edgeApiHandler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext,
  });

export const apiHandler = createNextApiHandler({
  router: appRouter,
  createContext,
});
