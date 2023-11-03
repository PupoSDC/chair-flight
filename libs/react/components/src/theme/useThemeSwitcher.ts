import { useCallback, useEffect, useState } from "react";
import { useColorScheme } from "@mui/joy";
import type { DefaultColorScheme } from "@mui/joy/styles/types";

export type ThemeColor = "rose" | "teal" | "blue";
export type ThemeColorSchemeLight = "lightRose" | "lightTeal" | "lightBlue";

export const useThemeSwitcher = (): [
  currentTheme: "rose" | "teal" | "blue",
  setCurrentTheme: (theme: "rose" | "teal" | "blue") => void,
] => {
  const { setColorScheme, colorScheme } = useColorScheme();
  const [currentTheme, setStateCurrentTheme] = useState<ThemeColor>("blue");

  useEffect(() => {
    const newCurrentTheme = (colorScheme ?? "blue")
      .toLocaleLowerCase()
      .replace("light", "")
      .replace("dark", "") as ThemeColor;
    setStateCurrentTheme(newCurrentTheme);
  }, [colorScheme]);

  const setCurrentTheme = useCallback(
    (theme: ThemeColor) => {
      const themeWithUppercase = theme[0].toUpperCase() + theme.slice(1);
      setColorScheme({
        light: `light${themeWithUppercase}` as DefaultColorScheme,
        dark: `dark${themeWithUppercase}` as DefaultColorScheme,
      });
    },
    [setColorScheme],
  );

  return [currentTheme, setCurrentTheme];
};
