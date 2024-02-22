import { forwardRef } from "react";
import { Box, Divider, Stack } from "@mui/joy";
import type { StackProps } from "@mui/joy";

export type AppFooterProps = StackProps;

export const AppFooter = forwardRef<HTMLHeadingElement, AppFooterProps>(
  (props, ref) => (
    <>
      <Stack
        {...props}
        ref={ref}
        component="footer"
        sx={{ mb: 4, alignItems: "center", ...props.sx }}
      >
        <Divider sx={{ mt: 4, mb: 4 }} />
        <Stack
          direction="row"
          sx={{
            justifyContent: "flex-start",
            width: "100%",
            maxWidth: "lg",
            px: { xs: 1, md: 2 },
          }}
        >
          {props.children}
        </Stack>
      </Stack>
    </>
  ),
);

AppFooter.displayName = "AppFooter";
