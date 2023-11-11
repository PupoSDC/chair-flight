import { extendTheme } from "@mui/joy";
import type { CssVarsThemeOptions } from "@mui/joy";

const basicTheme = extendTheme();

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

  interface ColorSchemeOverrides {
    light: false;
    dark: false;
    lightBlue: true;
    lightTeal: true;
    lightRose: true;
    darkBlue: true;
    darkTeal: true;
    darkRose: true;
  }
}

const extraColors = {
  primaryBlue: {
    "50": "#EDF5FD",
    "100": "#E3EFFB",
    "200": "#C7DFF7",
    "300": "#97C3F0",
    "400": "#4393E4",
    "500": "#0B6BCB",
    "600": "#185EA5",
    "700": "#12467B",
    "800": "#0A2744",
    "900": "#051423",
  },
  primaryTeal: {
    "50": "#f0fdf4",
    "100": "#dcfce7",
    "200": "#bbf7d0",
    "300": "#86efac",
    "400": "#4ade80",
    "500": "#22c55e",
    "600": "#16a34a",
    "700": "#15803d",
    "800": "#166534",
    "900": "#14532d",
  },
  primaryRose: {
    "50": "#ffebee",
    "100": "#ffcdd2",
    "200": "#ef9a9a",
    "300": "#e57373",
    "400": "#ef5350",
    "500": "#f44336",
    "600": "#e53935",
    "700": "#d32f2f",
    "800": "#c62828",
    "900": "#b71c1c",
  },
};

const lightBackground = {
  background: {
    body: "var(--joy-palette-primary-50)",
  },
};

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
    lightBlue: {
      ...basicTheme.colorSchemes.light,
      palette: {
        ...basicTheme.colorSchemes.light.palette,
        ...extraColors,
        ...lightBackground,
      },
    },
    lightTeal: {
      ...basicTheme.colorSchemes.light,
      palette: {
        ...basicTheme.colorSchemes.light.palette,
        ...extraColors,
        ...lightBackground,
        primary: extraColors.primaryTeal,
      },
    },
    lightRose: {
      ...basicTheme.colorSchemes.light,
      palette: {
        ...basicTheme.colorSchemes.light.palette,
        ...extraColors,
        ...lightBackground,
        primary: extraColors.primaryRose,
      },
    },
    darkBlue: {
      ...basicTheme.colorSchemes.dark,
      palette: {
        ...basicTheme.colorSchemes.dark.palette,
        ...extraColors,
      },
    },
    darkTeal: {
      ...basicTheme.colorSchemes.dark,
      palette: {
        ...basicTheme.colorSchemes.dark.palette,
        ...extraColors,
        primary: extraColors.primaryTeal,
      },
    },
    darkRose: {
      ...basicTheme.colorSchemes.dark,
      palette: {
        ...basicTheme.colorSchemes.dark.palette,
        ...extraColors,
        primary: extraColors.primaryRose,
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
