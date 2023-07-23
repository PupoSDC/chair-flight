import {
  forwardRef,
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { NoSsr } from "@mui/base";
import { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as LightModeIcon } from "@mui/icons-material/LightMode";
import { default as HamburgerIcon } from "@mui/icons-material/Menu";
import { Box, Link, styled, useColorScheme, useTheme } from "@mui/joy";
import { HEADER_HEIGHT } from "../constants";
import { Drawer } from "../drawer";
import { useMediaQuery } from "../hooks/use-media-query";
import { AppLogo } from "./app-logo";
import { IconButton } from "./header-icon-button";
import type { BoxProps } from "@mui/joy";

const StyledHeaderCompanion = styled("div")`
  height: ${HEADER_HEIGHT}px;
  width: 100%;
  content: "";
`;

const StyledHeader = styled("header")`
  color: ${({ theme }) => theme.vars.palette.text.primary};
  width: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${HEADER_HEIGHT}px;
  padding: 0 1rem 0 2rem;
  background-color: ${({ theme }) => theme.vars.palette.neutral.plainHoverBg};
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadow.md};

  & > a:nth-of-type(1) {
    margin-left: ${({ theme }) => theme.spacing(1)};
    display: flex;
    vertical-align: center;
    align-items: center;
    text-decoration: none;
  }

  & > a:nth-of-type(1) > h2 {
    font-size: 14px;
    margin: 0 6px;
    font-weight: 700;
    letter-spacing: 0.05rem;
    color: var(--joy-palette-neutral-plainColor);
  }

  & > a:nth-of-type(1) > svg {
    width: 25px;
    height: 25px;
    fill: var(--joy-palette-primary-plainColor);
  }

  &:after {
    content: "alpha";
    position: absolute;
    width: 80px;
    height: 25px;
    background: #ffc107;
    top: 4px;
    left: -25px;
    z-index: 3000;
    text-align: center;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bold;
    color: #fff;
    line-height: 27px;
    transform: rotate(-45deg);
  }

  & .children {
    flex: 1;
    padding-left: ${({ theme }) => theme.spacing(2)};
    display: none;

    ${({ theme }) => theme.breakpoints.up("md")} {
      display: flex;
    }
  }

  & .hamburger {
    display: flex;

    ${({ theme }) => theme.breakpoints.up("md")} {
      display: none;
    }
  }
`;

export type HeaderProps = {
  removeLogo?: boolean;
  removeThemeControl?: boolean;
  removeGithubLink?: boolean;
  removeHamburger?: boolean;
} & Partial<Pick<BoxProps, "sx" | "style" | "className" | "children">>;

const HeaderContext = createContext<{
  canDrawerBeOpened: boolean;
  closeDrawer: () => void;
}>({
  canDrawerBeOpened: false,
  closeDrawer: () => {
    /** Intentionally empty */
  },
});

/**
 * An header component that can, in theory, be used for all our pages.
 *
 * It includes a context, that can be accessed via `useHeaderContext`, so that
 * you can control the drawer component from withing the drawer components.
 *
 * Drawer becomes available only on mobile screens (breakpoint `md`) and if
 * a children is provided to this component.
 */
export const Header = forwardRef<HTMLHeadingElement, HeaderProps>(
  (
    {
      removeLogo,
      removeThemeControl,
      removeGithubLink,
      removeHamburger,
      children,
      ...boxProps
    },
    ref,
  ) => {
    const [isMounted, setIsMounted] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { mode, setMode } = useColorScheme();
    const toggleTheme = () => setMode(mode === "dark" ? "light" : "dark");
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
    const theme = useTheme();
    const showDarkModeButton = !isMounted || mode === "light";
    const canDrawerBeOpened =
      useMediaQuery(theme.breakpoints.down("md")) && !!children;

    const headerContextValue = useMemo(
      () => ({
        closeDrawer,
        canDrawerBeOpened,
      }),
      [closeDrawer, canDrawerBeOpened],
    );

    useEffect(() => setIsMounted(true), []);

    return (
      <HeaderContext.Provider value={headerContextValue}>
        <StyledHeader ref={ref} {...boxProps}>
          {removeLogo || (
            <Link href="/">
              <AppLogo />
              <h2>CHAIR FLIGHT</h2>
            </Link>
          )}
          <Box className="children">
            <NoSsr>{children}</NoSsr>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {!removeGithubLink && (
            <IconButton
              component={Link}
              target="_blank"
              href="https://github.com/PupoSDC/chair-flight"
            >
              <GithubIcon />
            </IconButton>
          )}
          {!removeThemeControl && (
            <IconButton onClick={toggleTheme}>
              {showDarkModeButton ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          )}
          {children && !removeHamburger && (
            <IconButton
              onClick={() => setIsDrawerOpen(true)}
              className="hamburger"
            >
              <HamburgerIcon />
            </IconButton>
          )}
        </StyledHeader>
        <StyledHeaderCompanion />
        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          {children}
        </Drawer>
      </HeaderContext.Provider>
    );
  },
);

export const useHeaderContext = () => useContext(HeaderContext);
