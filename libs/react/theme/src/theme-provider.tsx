import { CssBaseline, CssVarsProvider, GlobalStyles } from "@mui/joy";
import { theme } from "./theme";
import { ThemeStopResizeAnimation } from "./theme-stop-resize-animation";
import type { FunctionComponent, ReactNode } from "react";

export type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
}) => (
  <CssVarsProvider defaultMode="light" theme={theme}>
    <CssBaseline />
    <GlobalStyles
      styles={{
        html: { minHeight: "100vh" },
        body: { minHeight: "100vh" },
      }}
    />
    <ThemeStopResizeAnimation />
    {children}
  </CssVarsProvider>
);
