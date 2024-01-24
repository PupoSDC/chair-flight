import { NoSsr } from "@mui/base";
import type { FunctionComponent } from "react";

export function noSsr<P>(
  Component: FunctionComponent<P>,
  Fallback: FunctionComponent<P>,
): FunctionComponent<P & Record<string, never>> {
  return (props: P & Record<string, never>) => (
    <NoSsr fallback={<Fallback {...props} />}>{<Component {...props} />}</NoSsr>
  );
}
