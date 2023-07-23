import * as trpcNext from '@trpc/server/adapters/next';
import { appRouter } from '@chair-flight/next/trpc';

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});