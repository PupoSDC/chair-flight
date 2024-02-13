import { MissingPathParameter } from "@cf/base/errors";
import { ContainerWrapper } from "@cf/react/components";
import type { ContainerWrapperProps } from "@cf/react/components";
import type { TrpcHelper } from "@cf/trpc/server";
import type { SxProps } from "@mui/joy/styles/types";
import type { ElementType, FunctionComponent } from "react";

export type CommonContainerProps = {
  noSsr?: boolean;
  deferRendering?: boolean;
};

export type CommonComponentProps = {
  sx?: SxProps;
  component?: ElementType;
};

export type Container<
  Props extends Record<string, unknown> = Record<string, never>,
  Params = Record<string, unknown>,
  Data = Params,
> = FunctionComponent<Props & CommonComponentProps & CommonContainerProps> & {
  getData: (args: { helper: TrpcHelper; params: Params }) => Promise<Data>;
  useData: (params: Params) => Data;
  ErrorFallback?: ContainerWrapperProps["ErrorFallbackComponent"];
  LoadingFallback?: ContainerWrapperProps["LoadingFallbackComponent"];
};

export const container = <
  Props extends Record<string, unknown> = Record<string, never>,
  Params = Record<string, unknown>,
  Data = Params,
>(
  Component: FunctionComponent<
    Omit<Props, "noSsr" | "deferRendering"> & CommonComponentProps
  >,
): Container<Props, Params, Data> => {
  const Container: Container<Props, Params, Data> = ({
    noSsr,
    deferRendering,
    ...props
  }) => (
    <ContainerWrapper
      sx={props.sx}
      noSsr={noSsr}
      deferRendering={deferRendering}
      ErrorFallbackComponent={Container.ErrorFallback}
      LoadingFallbackComponent={Container.LoadingFallback}
    >
      <Component {...props} />
    </ContainerWrapper>
  );

  /** Has to be implemented outside this helper! */
  Container.useData = undefined as unknown as (typeof Container)["useData"];
  /** Has to be implemented outside this helper! */
  Container.getData = undefined as unknown as (typeof Container)["getData"];

  return Container;
};
