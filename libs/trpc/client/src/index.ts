import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { createTRPCMsw } from "msw-trpc";
import { getEnvVariableOrDefault } from "@chair-flight/base/env";
import type { AppRouter } from "@chair-flight/trpc/server";

function getBaseUrl() {
  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  const PORT = getEnvVariableOrDefault("PORT", "3000");
  if (typeof window !== "undefined") return "";
  if (VERCEL_URL) return `https://${VERCEL_URL}`;
  else return `http://localhost:${PORT}`;
}

export const trpc = createTRPCNext<AppRouter>({
  ssr: false,
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
});

export const trpcMsw = createTRPCMsw<AppRouter>();
