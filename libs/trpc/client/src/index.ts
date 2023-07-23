import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { getEnvVariableOrDefault } from "@chair-flight/base/env";
import type { AppRouter } from "@chair-flight/trpc/server";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  const PORT = getEnvVariableOrDefault("PORT", "3000");
  return `http://localhost:${PORT}`;
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
