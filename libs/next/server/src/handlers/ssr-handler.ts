import { NotFoundError } from "@chair-flight/base/errors";
import { getQuestionBank } from "@chair-flight/question-bank/providers";
import type { QuestionBankRepository } from "@chair-flight/base/types";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next/types";
import type { ParsedUrlQuery } from "querystring";

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
  const questionBank = getQuestionBank();

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
