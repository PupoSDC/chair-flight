import { useTheme } from "../../hooks/use-theme";
import { MoonIcon } from "../../icons/moon-icon";
import { SunIcon } from "../../icons/sun-icon";
import { IconButton } from "./icon-button";
import type { FC } from "react";

export const ThemeToggle: FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <IconButton
      label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
      className={className}
    >
      {theme === "light" ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  );
};
