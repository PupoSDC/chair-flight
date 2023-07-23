import { QuestionBankLocalRepository } from "@chair-flight/question-bank/providers";
import type { QuestionBankRepository } from "@chair-flight/base/types";
import type {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
  GetStaticPathsResult,
} from "next/types";
import type { ParsedUrlQuery } from "querystring";

export type HandleGetStaticProps<
  Props extends Record<string, unknown>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
> = (
  context: GetStaticPropsContext<Params, Preview>,
  questionBank: QuestionBankRepository,
) => Promise<GetStaticPropsResult<Props>> | GetStaticPropsResult<Props>;

export const staticHandler = <
  Props extends Record<string, unknown>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>(
  handler: ({
    context,
    questionBank,
  }: {
    context: GetStaticPropsContext<Params, Preview>;
    questionBank: QuestionBankRepository;
  }) => Promise<GetStaticPropsResult<Props>> | GetStaticPropsResult<Props>,
): GetStaticProps<Props, Params, Preview> => {
  const questionBank = new QuestionBankLocalRepository();

  return async (context) =>
    handler({
      context,
      questionBank,
    });
};

export const staticPathsHandler = <
  Params extends ParsedUrlQuery = ParsedUrlQuery,
>(
  handler: (
    questionBank: QuestionBankRepository,
  ) => Promise<GetStaticPathsResult<Params>>,
) => {
  const questionBank = new QuestionBankLocalRepository();

  return async () => handler(questionBank);
};
