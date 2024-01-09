import type { TrpcHelper } from "@chair-flight/trpc/server";
import type { FunctionComponent } from "react";

export type ContainerComponent<
  Props = Record<string, never>,
  Params = Record<string, never>,
  Data = Params,
> = FunctionComponent<Props & Params> & {
  getData: (args: { helper: TrpcHelper; params: Params }) => Promise<Data>;
  useData: (params: Params) => Data;
};
