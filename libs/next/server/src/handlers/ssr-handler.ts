import { NotFoundError } from "@chair-flight/base/errors";
import {
  QuestionBankLocalRepository,
  QuestionBankRedisRepository,
} from "@chair-flight/question-bank";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next/types";
import type { ParsedUrlQuery } from "querystring";
import type { QuestionBankRepository } from "@chair-flight/base/types";

const handleError = <T>(
  error: unknown
): GetServerSidePropsResult<T> | undefined => {
  if (error instanceof NotFoundError) {
    return {
      notFound: true,
    };
  }
  return undefined;
};

export const ssrHandler = <
  Props extends Record<string, unknown>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData
>(
  handler: ({
    context,
    questionBank,
  }: {
    context: GetServerSidePropsContext<Params, Preview>;
    questionBank: QuestionBankRepository;
  }) => Promise<GetServerSidePropsResult<Props>>
): GetServerSideProps<Props, Params, Preview> => {
  const questionBank =
    process.env["NODE_ENV"] !== "development" ||
    process.env["QUESTION_BANK_PROVIDER"] === "redis"
      ? new QuestionBankRedisRepository()
      : new QuestionBankLocalRepository();

  return async (context) => {
    try {
      return await handler({
        context,
        questionBank,
      });
    } catch (error) {
      const resolution = handleError<Props>(error);
      if (resolution) return resolution;
      throw error;
    }
  };
};
