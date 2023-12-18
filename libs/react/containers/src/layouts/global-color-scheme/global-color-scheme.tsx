import { GlobalStyles } from "@mui/material";
import type { ModuleName } from "@chair-flight/base/types";
import type { DefaultPaletteRange } from "@mui/joy/styles/types";
import type { FC } from "react";

export type GlobalColorSchemeProps = {
  module?: ModuleName;
};

const getGlobalColorScheme = (palette: DefaultPaletteRange) => ({
  '[data-joy-color-scheme="dark"], [data-joy-color-scheme="light"]': {
    "--joy-palette-primary-50": palette[50],
    "--joy-palette-primary-100": palette[100],
    "--joy-palette-primary-200": palette[200],
    "--joy-palette-primary-300": palette[300],
    "--joy-palette-primary-400": palette[400],
    "--joy-palette-primary-500": palette[500],
    "--joy-palette-primary-600": palette[600],
    "--joy-palette-primary-700": palette[700],
    "--joy-palette-primary-800": palette[800],
    "--joy-palette-primary-900": palette[900],
    "--joy-palette-primary-mainChannel": palette.mainChannel,
    "--joy-palette-primary-darkChannel": palette.darkChannel,
    "--joy-palette-primary-lightChannel": palette.lightChannel,
  },
});

export const GlobalColorScheme: FC<GlobalColorSchemeProps> = ({ module }) => (
  <GlobalStyles
    styles={(t) => {
      const palette = t.colorSchemes.light.palette;
      switch (module) {
        case "737":
          return getGlobalColorScheme(palette.primaryRose);
        case "a320":
          return getGlobalColorScheme(palette.primaryRose);
        case "prep":
          return getGlobalColorScheme(palette.primaryTeal);
        case "atpl":
          return getGlobalColorScheme(palette.primaryBlue);
        default:
          return getGlobalColorScheme(palette.primaryBlue);
      }
    }}
  />
);
