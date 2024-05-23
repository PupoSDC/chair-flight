import { extendTheme } from "@mui/joy";
import { ThemeCustomLink } from "./theme-custom-link";

const basicTheme = extendTheme();

declare module "@mui/joy/styles" {
  interface TypographySystemOverrides {
    h1: true;
    h2: true;
    h3: true;
    h4: true;
    h5: true;
    "title-lg": true;
    "title-md": true;
    "title-sm": true;
    "body-lg": true;
    "body-md": true;
    "body-sm": true;
    "body-xs": true;
  }

  interface PaletteOverrides {
    primaryBlue: true;
    primaryTeal: true;
    primaryRose: true;
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
    mainChannel: "11 107 203",
    darkChannel: "18 70 123",
    lightChannel: "199 223 247",
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
    mainChannel: "34 197 94",
    darkChannel: "21 128 61",
    lightChannel: "187 247 208",
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
    mainChannel: "244 67 54",
    darkChannel: "211 47 47",
    lightChannel: "239 154 154",
  },
};

const lightBackground = {
  background: {
    body: "var(--joy-palette-primary-50)",
  },
};

// @mui-x relies on some mui theme props that do not exist in joy themes.
const muiThemeBackwardsCompatibility = {
  shape: {
    borderRadius: 8,
  },
  transitions: {
    create: () => "ok",
  },
};

export const theme = extendTheme({
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
      ...basicTheme.colorSchemes.light,
      palette: {
        ...basicTheme.colorSchemes.light.palette,
        ...extraColors,
        ...lightBackground,
        primary: extraColors.primaryBlue,
      },
    },
    dark: {
      ...basicTheme.colorSchemes.dark,
      palette: {
        ...basicTheme.colorSchemes.dark.palette,
        ...extraColors,
        primary: extraColors.primaryBlue,
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
    JoyLink: {
      defaultProps: {
        component: ThemeCustomLink,
      },
    },
    JoyDrawer: {
      styleOverrides: {
        root: () => ({
          "--Drawer-transitionDuration": "0.15s",
        }),
      },
    },
  },
  ...muiThemeBackwardsCompatibility,
});
