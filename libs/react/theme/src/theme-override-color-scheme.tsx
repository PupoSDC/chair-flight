import { GlobalStyles } from "@mui/material";
import type { DefaultPaletteRange } from "@mui/joy/styles/types";
import type { FC } from "react";

export type ThemeOverrideColorSchemeProps = {
  questionBank?: "type" | "prep" | "atpl";
};

const getGlobalColorScheme = (palette: DefaultPaletteRange) => ({
  'html[data-joy-color-scheme="dark"], html[data-joy-color-scheme="light"]': {
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

export const ThemeOverrideColorScheme: FC<ThemeOverrideColorSchemeProps> = ({
  questionBank,
}) => (
  <GlobalStyles
    styles={(t) => {
      const palette = t.colorSchemes.light.palette;
      switch (questionBank) {
        case "type":
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
