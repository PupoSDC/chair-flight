import { AxiosError } from "axios";
import { performance } from "perf_hooks";
import { ZodError } from "zod";
import {
  NotFoundError,
  UnauthorizedError,
  UnimplementedEndpointError,
  UnimplementedError,
} from "@chair-flight/base/errors";
import {
  QuestionBankLocalRepository,
  QuestionBankRedisRepository,
} from "@chair-flight/question-bank";
import type {
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from "next/types";
import type { QuestionBankRepository } from "@chair-flight/base/types";

type ApiContext = {
  req: NextApiRequest;
  questionBank: QuestionBankRepository;
};

type Methods = "get" | "post" | "put" | "delete";

type Handlers = Partial<Record<Methods, (props: ApiContext) => unknown>>;

type HandlerOptions = {
  isAvailable: boolean;
  requiresAuthentication: boolean;
};

const handleError = (res: NextApiResponse, error: unknown) => {
  if (error instanceof ZodError) {
    return res.status(400).send("Invalid payload");
  }
  if (error instanceof NotFoundError) {
    return res.status(404).send(error.message);
  }
  if (error instanceof UnauthorizedError) {
    return res.status(401).send("Unauthorized");
  }
  if (error instanceof UnimplementedError) {
    return res.status(501).send("Not Implemented");
  }

  //
  console.error(error);
  if (error instanceof AxiosError) {
    return res.status(500).send("Unexpected Error");
  }

  return res.status(500).send("Unexpected Error");
};

export const apiHandler = (
  handlers: Handlers,
  options: HandlerOptions
): NextApiHandler => {
  return async (req, res) => {
    const start = performance.now();
    process.env["performance-start"] = start.toString();
    const method = req.method?.toLowerCase();
    const callback = handlers[method as "get"];

    const questionBank =
      process.env["NODE_ENV"] !== "development" ||
      process.env["QUESTION_BANK_PROVIDER"] === "redis"
        ? new QuestionBankRedisRepository()
        : new QuestionBankLocalRepository();

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

    try {
      const { isAvailable, requiresAuthentication } = options;
      if (!isAvailable) {
        throw new NotFoundError(method);
      }
      if (requiresAuthentication) {
        throw new UnauthorizedError("Missing user authentication");
      }
      if (!callback) {
        throw new UnimplementedEndpointError(method, req.url);
      }

      const response = await callback({
        req,
        questionBank,
      });

      const end = performance.now();
      console.debug(`[Execution time](${req.url}): ${end - start} ms`);
      return res.status(200).json(response);
    } catch (error) {
      return handleError(res, error);
    }
  };
};
