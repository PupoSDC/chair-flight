import { NotFoundError } from "@cf/base/errors";
import { getTrpcHelper } from "./trpc-helper";
import type { TrpcHelper } from "./trpc-helper";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  PreviewData,
} from "next/types";
import type { ParsedUrlQuery } from "querystring";

const handleError = <T>(
  error: unknown,
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
  Preview extends PreviewData = PreviewData,
>(
  handler: ({
    context,
    helper,
  }: {
    params: Params;
    context: GetServerSidePropsContext<Params, Preview>;
    helper: TrpcHelper;
  }) => Promise<GetServerSidePropsResult<Props> | void>,
): GetServerSideProps<Props, Params, Preview> => {
  return async (context) => {
    try {
      const helper = await getTrpcHelper();

      const handlerResponse = await handler({
        params: context.params ?? ({} as Params),
        context,
        helper,
      });

      const response = handlerResponse ?? { props: {} as Props };
      const castResponse = response as { props?: Record<string, unknown> };

      if (castResponse.props) {
        castResponse.props["trpcState"] = helper.dehydrate();
      }
      return response;
    } catch (error) {
      const resolution = handleError<Props>(error);

      if (resolution) return resolution;
      throw error;
    }
  };
};
