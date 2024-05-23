import { GlobalStyles } from "@mui/joy";

export const ThemeGlobalStyles = () => (
  <GlobalStyles
    styles={{
      ':root[data-joy-color-scheme="dark"]': {
        ".light-only": {
          display: "none",
        },
        ".dark-only": {
          display: "initial",
        },
      },
      ':root[data-joy-color-scheme="light"]': {
        ".light-only": {
          display: "initial",
        },
        ".dark-only": {
          display: "none",
        },
      },
    }}
  />
);
