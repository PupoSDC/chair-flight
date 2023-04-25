import type { CssVarsThemeOptions } from "@mui/joy";

export const theme: CssVarsThemeOptions = {
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
};
