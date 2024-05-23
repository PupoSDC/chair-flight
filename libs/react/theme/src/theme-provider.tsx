import { memo, type FunctionComponent, type ReactNode } from "react";
import { CssBaseline, CssVarsProvider } from "@mui/joy";
import { theme } from "./theme";
import { ThemeGlobalStyles } from "./theme-global-styles";
import { ThemeStopResizeAnimation } from "./theme-stop-resize-animation";

export type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = memo(
  ({ children }) => (
    <CssVarsProvider defaultMode="light" theme={theme}>
      <CssBaseline />
      <ThemeStopResizeAnimation />
      <ThemeGlobalStyles />
      {children}
    </CssVarsProvider>
  ),
);

ThemeProvider.displayName = "ThemeProvider";
