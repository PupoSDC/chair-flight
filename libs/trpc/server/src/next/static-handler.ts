import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  PreviewData,
} from "next/types";
import { ParsedUrlQuery } from "querystring";
import { questionBanks } from "@chair-flight/core/question-bank";
import { TrpcHelper, getTrpcHelper } from "./trpc-helper";

type FS = {
  readFile: (path: string, string: "utf-8") => Promise<string>;
};

export const staticHandler = <
  Props extends Record<string, unknown>,
  Params extends ParsedUrlQuery = ParsedUrlQuery,
  Preview extends PreviewData = PreviewData,
>(
  handler: ({
    context,
    helper,
  }: {
    params: Params;
    context: GetStaticPropsContext<Params, Preview>;
    helper: TrpcHelper;
  }) => Promise<GetStaticPropsResult<Props>>,
  fs: FS,
): GetStaticProps<Props, Params, Preview> => {
  return async (context) => {
    await Promise.all(
      Object.values(questionBanks).map((qb) => qb.preloadForStaticRender(fs)),
    );
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
  };
};
