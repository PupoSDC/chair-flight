import { AxiosError } from 'axios';
import { performance } from 'perf_hooks';
import { ZodError } from 'zod';
import {
  NotFoundError,
  UnauthorizedError,
  UnimplementedEndpointError,
  UnimplementedError,
} from './errors';

import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next/types';

type ApiContext = {
  req: NextApiRequest;
};

type Methods = 'get' | 'post' | 'put' | 'delete';

type Handlers = Partial<Record<Methods, (props: ApiContext) => unknown>>;

type HandlerOptions = {
  isAvailable: boolean;
  requiresAuthentication: boolean;
};

const handleError = (res: NextApiResponse, error: unknown) => {
  console.error(error);
  if (error instanceof AxiosError) {
    return res.status(500).send('Unexpected Error');
  }
  if (error instanceof UnimplementedError) {
    return res.status(501).send('Not Implemented');
  }
  if (error instanceof ZodError) {
    return res.status(400).send('Invalid payload');
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send('Not Found');
  }
  if (error instanceof UnauthorizedError) {
    return res.status(401).send('Unauthorized');
  }
  return res.status(500).send('Unexpected Error');
};

export const apiHandler = (
  handlers: Handlers,
  options: HandlerOptions
): NextApiHandler => {
  return async (req, res) => {
    const start = performance.now();
    const method = req.method?.toLowerCase();
    const callback = handlers[method as 'get'];

    // const getFirebaseAdmin = async () => {
    //   if (!firebaseAdmin) {
    //     const { getFirebaseAdmin } = await import("@cf/config/firebaseAdmin");
    //     firebaseAdmin = await getFirebaseAdmin();
    //   }
    //   return firebaseAdmin;
    // };

    //const getCurrentUserToken = async () => {
    //  if (!currentUser) {
    //    const { getCurrentUserToken } = await import("./getCurrentUserToken");
    //    currentUser = await getCurrentUserToken(req, getFirebaseAdmin);
    //  }
    //  return currentUser as DecodedIdToken;
    //};

    //const getQuestionBank = async () => {
    //  if (!questionBank) {
    //    questionBank = await import("chair-flight-question-bank");
    //  }
    //  return questionBank;
    //};

    // const getQueryClient = async () => {
    //   if (!queryClient) {
    //     const { getQueryClient } = await import("@cf/config/queryClient");
    //     queryClient = getQueryClient();
    //   }
    //   return queryClient;
    // };

    try {
      const { isAvailable, requiresAuthentication } = options;
      if (!isAvailable) {
        throw new NotFoundError(method);
      }
      if (requiresAuthentication) {
        throw new UnauthorizedError('Missing user authentication');
      }
      if (!callback) {
        throw new UnimplementedEndpointError(method, req.url);
      }

      const response = await callback({
        req,
      });

      const end = performance.now();
      console.debug(`[Execution time](${req.url}): ${end - start} ms`);
      return res.status(200).json(response);
    } catch (error) {
      return handleError(res, error);
    }
  };
};
