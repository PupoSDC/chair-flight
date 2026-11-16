import { useTheme } from "../../hooks/use-theme";
import { MoonIcon } from "../../icons/moon-icon";
import { SunIcon } from "../../icons/sun-icon";
import { ButtonIcon } from "./button-icon";
import type { FC } from "react";

export const ThemeToggle: FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ButtonIcon
      label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      onClick={toggleTheme}
      className={className}
      icon={theme === "light" ? SunIcon : MoonIcon}
    />
  );
};
