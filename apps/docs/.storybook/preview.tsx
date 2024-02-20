import React, { Suspense, useEffect } from "react";
import { default as Typography } from "@mui/joy/Typography";
import { useColorScheme } from "@mui/joy/styles";
import { DocsContainer } from "@storybook/addon-docs";
import { themes } from "@storybook/theming";
import { initialize, mswLoader } from "msw-storybook-addon";
import { useDarkMode } from "storybook-dark-mode";
import { ThemeProvider } from "@cf/react/theme";
import { trpc } from "@cf/trpc/client";
import type { TypographyProps } from "@mui/joy";
import type { DocsContainerProps } from "@storybook/addon-docs";
import type { Preview } from "@storybook/react";
import type { FunctionComponent } from "react";
import "@fontsource/public-sans";

// TODO this is a complete hack. Open ticket with SB
window.React = React;

initialize({
  onUnhandledRequest: ({ url }, print) => {
    if (url.includes("/trpc")) {
      print.error();
    }
  },
});

const ToggleDarkMode: FunctionComponent = () => {
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

// Violence is, as far as i know, the only solution.
// these colors were picked from the final computed theme. Using CSS vars
// crashes code blocks
themes.dark.appContentBg = "#131318";
themes.light.appContentBg = "#F4FAFF";

const preview: Preview = {
  parameters: {
    docs: {
      components: {
        h1: (props: TypographyProps) => <Typography level="h1" {...props} />,
        h2: (props: TypographyProps) => <Typography level="h2" {...props} />,
        h3: (props: TypographyProps) => <Typography level="h3" {...props} />,
        h4: (props: TypographyProps) => <Typography level="h4" {...props} />,
        h5: (props: TypographyProps) => <Typography level="h5" {...props} />,
        p: (props: TypographyProps) => <Typography {...props} />,
      },
      container: function Container(props: DocsContainerProps) {
        const dark = useDarkMode();
        const docsTheme = dark ? themes.dark : themes.light;
        return (
          <ThemeProvider>
            <ToggleDarkMode />
            <DocsContainer {...props} theme={docsTheme} />
          </ThemeProvider>
        );
      },
    },
    actions: {
      argTypesRegex: "^on.*",
    },
    options: {
      storySort: {
        order: ["docs", "components", "containers"],
      },
    },
  },
  // note: Loaders are loaded in reverse order
  decorators: [
    (Story) => (
      <Suspense fallback="Loading...">
        <Story />
      </Suspense>
    ),
    (Story) => (
      <ThemeProvider>
        <ToggleDarkMode />
        <Story />
      </ThemeProvider>
    ),
    (Story) => {
      const Component = trpc.withTRPC(Story);
      return <Component />;
    },
  ],
  loaders: [mswLoader],
};

export default preview;
