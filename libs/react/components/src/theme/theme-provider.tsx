import { CssBaseline, CssVarsProvider } from "@mui/joy";
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
    <ThemeStopResizeAnimation />
    {children}
  </CssVarsProvider>
);
