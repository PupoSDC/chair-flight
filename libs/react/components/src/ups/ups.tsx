import { forwardRef } from "react";
import { default as AirplanemodeInactiveIcon } from "@mui/icons-material/AirplanemodeInactive";
import { Box, Typography } from "@mui/joy";
import type { BoxProps } from "@mui/joy";

export type UpsProps = {
  color?: "danger" | "warning";
  message?: string;
} & Pick<BoxProps, "sx" | "style" | "className">;

/**
 * A really simple "ups" component to be used for showing errors or other non
 * normal situations.
 */
export const Ups = forwardRef<HTMLDivElement, UpsProps>(
  ({ color, message, ...boxProps }, ref) => (
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
    </Box>
  )
);
