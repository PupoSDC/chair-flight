import { useEffect, useState } from "react";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as LightModeIcon } from "@mui/icons-material/LightMode";
import { default as HamburgerIcon } from "@mui/icons-material/Menu";
import { Link, IconButton, styled, useColorScheme, Box } from "@mui/joy";
import type { IconButtonProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const GITHUB_URL = "https://github.com/PupoSDC/chair-flight";

export const GithubButton: FunctionComponent<IconButtonProps> = (props) => (
  <IconButton component={Link} target="_blank" href={GITHUB_URL} {...props}>
    <GithubIcon />
  </IconButton>
);

export const HamburgerButton: FunctionComponent<IconButtonProps> = (props) => (
  <IconButton {...props}>
    <HamburgerIcon />
  </IconButton>
);

export const ThemeButton: FunctionComponent<IconButtonProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { mode, setMode } = useColorScheme();
  const toggleTheme = () => setMode(mode === "dark" ? "light" : "dark");
  const showDarkModeButton = !isMounted || mode === "light";

  useEffect(() => setIsMounted(true), []);

  return (
    <IconButton
      {...props}
      onClick={(...args) => {
        toggleTheme();
        props.onClick?.(...args);
      }}
    >
      {showDarkModeButton ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export const BackButton: FunctionComponent<IconButtonProps> = (props) => {
  return (
    <IconButton {...props}>
      <ChevronLeftIcon />
    </IconButton>
  );
};

export const AppButtonsContainer = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
`;
