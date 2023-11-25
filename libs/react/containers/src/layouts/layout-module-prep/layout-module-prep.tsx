import { Box, GlobalStyles } from "@mui/joy";
import { getGlobalColorScheme } from "@chair-flight/react/components";
import type { FunctionComponent, ReactNode } from "react";

export type LayoutModulePrepProps = {
  children: ReactNode;
  fixedHeight?: boolean;
  noPadding?: boolean;
};

const HEIGHT = `100vh`;

export const LayoutModulePrep: FunctionComponent<LayoutModulePrepProps> = ({
  children,
  fixedHeight,
  noPadding,
}) => (
  <>
    <GlobalStyles
      styles={(t) => {
        return getGlobalColorScheme(t.colorSchemes.light.palette.primaryTeal);
      }}
    />
    <Box
      component="main"
      children={children}
      sx={{
        width: "100%",
        margin: "auto",
        ...(fixedHeight ? { height: HEIGHT } : { minHeight: HEIGHT }),
        ...(noPadding ? {} : { p: { xs: 2, md: 4 } }),
        ...(noPadding ? {} : { maxWidth: "md" }),
      }}
    />
  </>
);
