import { createServerSideHelpers } from "@trpc/react-query/server";
import { default as superJson } from "superjson";
import { appRouter } from "../config/app-router";
import { createContext } from "../config/context";

export const getTrpcHelper = async () =>
  createServerSideHelpers({
    router: appRouter,
    transformer: superJson,
    ctx: await createContext(),
  });

export type TrpcHelper = Awaited<ReturnType<typeof getTrpcHelper>>;
