import { FunctionComponent } from "react";
import { TrpcHelper } from "libs/trpc/server/src/next/trpc-helper";

export type ContainerComponent<P = {}> = FunctionComponent<P> & {
  getData: (args: { helper: TrpcHelper; props?: P }) => Promise<void>;
};
