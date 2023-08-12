import { httpLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { getEnvVariableOrDefault } from "@chair-flight/base/env";
import type { AppRouter } from "@chair-flight/trpc/server";
import type { QueryClientConfig } from "@tanstack/react-query";

const getBaseUrl = (): string => {
  const env = getEnvVariableOrDefault("NODE_ENV", "");
  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  const PORT = getEnvVariableOrDefault("PORT", "3000");

  if (env === "test") return `http://localhost:${PORT}`;

  if (typeof window !== "undefined") return "";

  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  return `http://localhost:${PORT}`;
};

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnWindowFocus: false,

      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
};

const links = [httpLink({ url: `${getBaseUrl()}/api/trpc` })];

export const trpc = createTRPCNext<AppRouter>({
  config: () => ({ queryClientConfig, links }),
});
