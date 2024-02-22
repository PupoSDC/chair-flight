import { forwardRef } from "react";
import { Stack } from "@mui/joy";
import type { StackProps } from "@mui/joy";

export type AppMainProps = Omit<StackProps, "component">;

export const AppMain = forwardRef<HTMLMediaElement, AppMainProps>(
  (props, ref) => (
    <Stack
      {...props}
      ref={ref}
      component="main"
      sx={{
        width: "100%",
        maxWidth: "md",
        mx: "auto",
        px: { xs: 1, md: 2 },
        py: 2,
        ...props.sx,
      }}
    />
  ),
);
