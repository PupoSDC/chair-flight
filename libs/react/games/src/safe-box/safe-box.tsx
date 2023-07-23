import { forwardRef } from "react";
import MuiBox from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";

export type SafeBoxProps = Omit<BoxProps, "component">;

/**
 * A Box component that gets around
 * [this limitation](https://github.com/mui/material-ui/issues/34068). The
 * downside being this component is limited to being a `div` element
 */
export const SafeBox = forwardRef<HTMLDivElement, SafeBoxProps>(
  (props, ref) => {
    return <MuiBox {...props} ref={ref} component="div" />;
  },
);
