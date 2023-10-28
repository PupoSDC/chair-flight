import { extendTheme, type CssVarsThemeOptions } from "@mui/joy";

declare module "@mui/joy/styles" {
  interface TypographySystemOverrides {
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    "title-lg": false;
    "title-md": false;
    "title-sm": false;
    "body-lg": true;
    "body-md": true;
    "body-sm": true;
    "body-xs": true;
  }
}

export const theme: CssVarsThemeOptions = extendTheme({
  typography: {
    h1: {
      fontSize: "2.8rem",
      fontWeight: "var(--joy-fontWeight-xl)",
    },
    h5: {
      fontSize: "var(--joy-fontSize-lg)",
      fontWeight: "var(--joy-fontWeight-lg)",
    },
    "title-lg": undefined,
    "title-md": undefined,
    "title-sm": undefined,
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: "var(--joy-palette-primary-50)",
        },
      },
    },
  },
  components: {
    JoyButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            // prevent button links from having an underline
            textDecoration: "none",
          },
        },
      },
    },
    JoySheet: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.radius.sm,

          "&:hover": {
            // prevent button links from having an underline
            textDecoration: "none",
          },
        }),
      },
    },
  },
});
