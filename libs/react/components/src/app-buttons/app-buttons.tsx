import { useEffect, useState } from "react";
import { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as LightModeIcon } from "@mui/icons-material/LightMode";
import { default as HamburgerIcon } from "@mui/icons-material/Menu";
import { Link, IconButton, styled, useColorScheme, Box } from "@mui/joy";
import type { IconButtonProps } from "@mui/joy";
import type { FunctionComponent } from "react";

const GITHUB_URL = "https://github.com/PupoSDC/chair-flight";

const StyledButton = styled(IconButton)`
  border: none;
  margin: 0;
  flex: 0;
  padding: 0;

  & > svg {
    font-size: 24px;
    color: ${({ theme }) => theme.vars.palette.text.primary};
  }

  &:hover {
    background-color: transparent;

    & > svg {
      color: ${({ theme }) => theme.vars.palette.primary.plainColor};
    }
  }
` as typeof IconButton;

export const GithubButton: FunctionComponent<IconButtonProps> = (props) => (
  <StyledButton component={Link} target="_blank" href={GITHUB_URL} {...props}>
    <GithubIcon />
  </StyledButton>
);

export const HamburgerButton: FunctionComponent<IconButtonProps> = (props) => (
  <StyledButton {...props}>
    <HamburgerIcon />
  </StyledButton>
);

export const ThemeButton: FunctionComponent<IconButtonProps> = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { mode, setMode } = useColorScheme();
  const toggleTheme = () => setMode(mode === "dark" ? "light" : "dark");
  const showDarkModeButton = !isMounted || mode === "light";

  useEffect(() => setIsMounted(true), []);

  return (
    <StyledButton onClick={toggleTheme} {...props}>
      {showDarkModeButton ? <DarkModeIcon /> : <LightModeIcon />}
    </StyledButton>
  );
};

export const AppButtonsContainer = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
`;
