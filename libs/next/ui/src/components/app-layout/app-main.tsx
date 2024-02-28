import { forwardRef } from "react";
import { default as Stack } from "@mui/joy/Stack";
import type { StackProps } from "@mui/joy";

export type AppMainProps = Omit<StackProps, "component">;

export const AppMain = forwardRef<HTMLMediaElement, AppMainProps>(
  (props, ref) => (
    <Stack
      {...props}
      ref={ref}
      component="main"
      sx={{
        flex: 1,
        width: "100%",
        maxWidth: "md",
        mx: "auto",
        p: { xs: 1, md: 2 },
        ...props.sx,
      }}
    />
  ),
);

AppMain.displayName = "AppMain";
