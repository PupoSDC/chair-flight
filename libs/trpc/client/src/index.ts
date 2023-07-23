import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { createTRPCMsw } from 'msw-trpc'
import type { AppRouter } from "@chair-flight/trpc/server";

function getBaseUrl() {
  if (typeof window !== 'undefined') 
    return '';
  if (process.env['VERCEL_URL']) 
    return `https://${process.env.VERCEL_URL}`;
  else
    return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  ssr: false,
  config(opts) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
});

export const trpcMsw = createTRPCMsw<AppRouter>() 