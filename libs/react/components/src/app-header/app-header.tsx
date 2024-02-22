import { forwardRef } from "react";
import { Box, Stack } from "@mui/joy";
import type { StackProps } from "@mui/joy";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type AppHeaderProps = StackProps;

const HEADER_HEIGHT = 48;

type Header = ForwardRefExoticComponent<
  Omit<AppHeaderProps, "component"> & RefAttributes<HTMLHeadingElement>
> & {
  height: number;
};

export const AppHeader = forwardRef<HTMLHeadingElement, AppHeaderProps>(
  (props, ref) => (
    <>
      <Stack
        {...props}
        ref={ref}
        component="header"
        sx={{
          flexDirection: "row",
          color: "text.primary",
          width: "100%",
          position: "fixed",
          alignItems: "center",
          justifyContent: "space-between",
          height: `${HEADER_HEIGHT}px`,
          px: { xs: 1, md: 2 },
          py: 0,
          backgroundColor: "neutral.plainHoverBg",
          zIndex: 1000,
          boxShadow: "md",

          "& nav": {
            flex: 1,
            pl: 3,
            display: "flex",
          },

          ...props.sx,
        }}
      />
      <Box sx={{ height: HEADER_HEIGHT, width: "100%", content: '""' }} />
    </>
  ),
) as Header;

AppHeader.displayName = "AppHeader";
AppHeader.height = HEADER_HEIGHT;
