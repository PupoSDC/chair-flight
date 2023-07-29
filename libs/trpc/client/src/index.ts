import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { getEnvVariableOrDefault } from "@chair-flight/base/env";
import type { AppRouter } from "@chair-flight/trpc/server";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return "";

  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  const PORT = getEnvVariableOrDefault("PORT", "3000");
  return `http://localhost:${PORT}`;
};

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      queryClientConfig: {
        defaultOptions: {
          queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      },
    };
  },
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
