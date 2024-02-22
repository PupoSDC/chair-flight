"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import { getEnvVariableOrDefault } from "@cf/base/env";
import type { AppRouter } from "@cf/trpc/server";

export const trpcNext14 = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

const getBaseUrl = (): string => {
  const env = getEnvVariableOrDefault("NODE_ENV", "");
  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  const PORT = getEnvVariableOrDefault("PORT", "3000");

  if (env === "test") return `http://localhost:${PORT}`;

  if (typeof window !== "undefined") return "";

  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  return `http://localhost:${PORT}`;
};

export function TrpcProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcNext14.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      transformer: superjson,
    }),
  );
  return (
    <trpcNext14.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </trpcNext14.Provider>
  );
}
