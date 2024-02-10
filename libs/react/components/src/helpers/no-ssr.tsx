import { NoSsr } from "@mui/base";
import type { FunctionComponent } from "react";

export function noSsr<P>(
  Component: FunctionComponent<P>,
  Fallback: FunctionComponent<P>,
): FunctionComponent<P & Record<string, never>> {
  const noSsr = (props: P & Record<string, never>) => (
    <NoSsr fallback={<Fallback {...props} />}>{<Component {...props} />}</NoSsr>
  );
  noSsr.displayName = `noSsr(${Component.displayName || Component.name})`;
  return noSsr;
}
