import { FunctionComponent } from "react";
import { TrpcHelper } from "libs/trpc/server/src/next/trpc-helper";

export type ContainerComponent<Props, Params, Data> = FunctionComponent<
  Props & Params
> & {
  getData: (args: { helper: TrpcHelper; params: Params }) => Promise<Data>;
  useData: (params: Params) => Data;
};
