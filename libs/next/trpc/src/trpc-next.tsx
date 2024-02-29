"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { default as superJson } from "superjson";
import { getEnvVariableOrDefault } from "@cf/base/env";
import type { AppRouter } from "@cf/providers/trpc";
import type { FunctionComponent, ReactNode } from "react";

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

const getBaseUrl = (): string => {
  const env = getEnvVariableOrDefault("NODE_ENV", "");
  const VERCEL_URL = getEnvVariableOrDefault("VERCEL_URL", "");
  const PORT = getEnvVariableOrDefault("PORT", "3000");

  if (env === "test") return `http://localhost:${PORT}`;

  if (typeof window !== "undefined") return "";

  if (VERCEL_URL) return `https://${VERCEL_URL}`;

  return `http://localhost:${PORT}`;
};

export type TRPCProviderProps = {
  children: ReactNode;
};

export const TrpcProvider: FunctionComponent<TRPCProviderProps> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: () => true,
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc2`,
        }),
      ],
      transformer: superJson,
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
