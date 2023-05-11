import { forwardRef } from "react";
import { default as AirplanemodeInactiveIcon } from "@mui/icons-material/AirplanemodeInactive";
import { Box, Typography } from "@mui/joy";
import type { BoxProps } from "@mui/joy";
import type { ReactNode } from "react";

export type UpsProps = {
  color?: "danger" | "warning";
  /**
   * The message shown on the top of the component
   */
  message?: string;
  /**
   * Rendered at the bottom of the component. Use to show a button or something
   * that allows the user to resolve the error / ups situation.
   */
  children?: ReactNode;
} & Pick<BoxProps, "sx" | "style" | "className">;

/**
 * A really simple "ups" component to be used for showing errors or other non
 * normal situations.
 *
 *
 */
export const Ups = forwardRef<HTMLDivElement, UpsProps>(
  ({ color, message, children, ...boxProps }, ref) => (
    <Box
      ref={ref}
      {...boxProps}
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        color: color ? `${color}.plainColor` : undefined,
        "--joy-palette-text-primary": color ? `${color}.plainColor` : undefined,
        ...boxProps.sx,
      }}
    >
      <Typography
        level="h3"
        children={message}
        sx={{
          color: color ? `${color}.plainColor` : undefined,
        }}
      />
      <AirplanemodeInactiveIcon
        sx={{
          color: color ? `${color}.plainColor` : undefined,
          my: 2,
          width: "100px",
          height: "100px",
        }}
      />
      {children}
    </Box>
  )
);
