"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { default as superjson } from "superjson";
import { getEnvVariableOrDefault } from "@cf/base/env";
import type { AppRouter } from "@cf/providers/trpc";
import type { FunctionComponent } from "react";

const getBaseUrl = (): string => {
  const env = getEnvVariableOrDefault("NODE_ENV", "");
  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  const PORT = getEnvVariableOrDefault("PORT", "3000");

  if (env === "test") return `http://localhost:${PORT}`;

  if (typeof window !== "undefined") return "";

  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  return `http://localhost:${PORT}`;
};

export const trpc = createTRPCReact<AppRouter>({
  unstable_overrides: {
    useMutation: {
      async onSuccess(opts) {
        await opts.originalFn();
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

export type TrpcProviderProps = {
  children: React.ReactNode;
};

export const TrpcProvider: FunctionComponent<TrpcProviderProps> = ({
  children,
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
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
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
