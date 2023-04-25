import { useEffect } from "react";
import { default as CssBaseline } from "@mui/joy/CssBaseline";
import { default as Typography } from "@mui/joy/Typography";
import { CssVarsProvider, extendTheme, useColorScheme } from "@mui/joy/styles";
import { DocsContainer, DocsContainerProps } from "@storybook/addon-docs";
import { Preview } from "@storybook/react";
import { themes } from "@storybook/theming";
import { useDarkMode } from "storybook-dark-mode";
import { theme } from "../src/theme";
import type { TypographyProps } from "@mui/joy";
import "@fontsource/public-sans";

const ToggleDarkMode = ({}) => {
  const isDarkMode = useDarkMode();
  const { setMode } = useColorScheme();
  useEffect(() => {
    const isHtmlDarkMode =
      document
        .getElementsByTagName("html")[0]
        .getAttribute("data-joy-color-scheme") === "dark";
    if (isDarkMode !== isHtmlDarkMode) {
      setMode(isDarkMode ? "dark" : "light");
    }
  });
  return null;
};

const joyTheme = extendTheme({
  ...theme,
});

// Violence is, as far as i know, the only solution.
themes.dark.appContentBg = "var(--joy-palette-background-body)";
themes.light.appContentBg = "var(--joy-palette-background-body)";

const preview: Preview = {
  parameters: {
    docs: {
      components: {
        h1: (props: TypographyProps) => <Typography level="h1" {...props} />,
        h2: (props: TypographyProps) => <Typography level="h2" {...props} />,
        h3: (props: TypographyProps) => <Typography level="h3" {...props} />,
        h4: (props: TypographyProps) => <Typography level="h4" {...props} />,
        h5: (props: TypographyProps) => <Typography level="h5" {...props} />,
        h6: (props: TypographyProps) => <Typography level="h6" {...props} />,
        p: (props: TypographyProps) => <Typography level="body1" {...props} />,
      },
      container: (props: DocsContainerProps) => {
        const dark = useDarkMode();
        const docsTheme = dark ? themes.dark : themes.light;
        return (
          <CssVarsProvider theme={joyTheme}>
            <CssBaseline />
            <ToggleDarkMode />
            <DocsContainer {...props} theme={docsTheme} />
          </CssVarsProvider>
        );
      },
    },
    actions: {
      argTypesRegex: "^on.*",
    },
  },
  decorators: [
    (Story) => (
      <CssVarsProvider theme={joyTheme}>
        <CssBaseline />
        <ToggleDarkMode />
        <Story />
      </CssVarsProvider>
    ),
  ],
};

export default preview;
