import { forwardRef, useEffect, useState } from "react";
import { NoSsr } from "@mui/base";
import { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as LightModeIcon } from "@mui/icons-material/LightMode";
import { default as HamburgerIcon } from "@mui/icons-material/Menu";
import {
  Box,
  GlobalStyles,
  IconButton,
  Link,
  iconButtonClasses,
  useColorScheme,
} from "@mui/joy";
import { AppLogo } from "./app-logo";
import type { BoxProps } from "@mui/joy";

const VAR_HEADER_HEIGHT = "--joy-header-height";
const HEADER_HEIGHT = 40;
const GITHUB_URL = "https://github.com/PupoSDC/chair-flight";

export type HeaderProps = {
  remove?: ("logo" | "theme" | "github" | "hamburger")[] | "all";
  borderStyle?: "shadow" | "outlined";
  onHamburgerClick?: () => void;
} & Partial<Pick<BoxProps, "sx" | "className" | "children">>;

export type HeaderComponent = React.ForwardRefExoticComponent<
  HeaderProps & React.RefAttributes<HTMLHeadingElement>
> & {
  css: {
    headerHeight: string;
  };
};

/**
 * An header component that can, in theory, be used for all our pages.
 *
 * The header height is available as a CSS variable, in `Header.css`
 *
 * Hamburger button is hidden for sizes below `sm`.
 */
export const Header = forwardRef<HTMLHeadingElement, HeaderProps>(
  (
    {
      remove = [],
      children,
      borderStyle = "shadow",
      onHamburgerClick,
      ...boxProps
    },
    ref,
  ) => {
    const [isMounted, setIsMounted] = useState(false);
    const { mode, setMode } = useColorScheme();
    const showDarkModeButton = !isMounted || mode === "light";
    const removeAll = remove === "all";
    const removeLogo = removeAll || remove.includes("logo");
    const removeTheme = removeAll || remove?.includes("theme");
    const removeGithub = removeAll || remove?.includes("github");
    const removeHamburger = removeAll || remove?.includes("hamburger");

    const toggleTheme = () => setMode(mode === "dark" ? "light" : "dark");

    useEffect(() => setIsMounted(true), []);

    return (
      <>
        <GlobalStyles
          styles={{
            body: {
              [VAR_HEADER_HEIGHT]: `${HEADER_HEIGHT}px`,
            },
          }}
        />
        <Box
          component="header"
          ref={ref}
          {...boxProps}
          sx={{
            color: "text.primary",
            width: "100%",
            position: "fixed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: `${HEADER_HEIGHT}px`,
            padding: (t) => t.spacing(0, 2, 0, 1),
            backgroundColor: "neutral.plainHoverBg",
            zIndex: 1000,

            "& > a:nth-of-type(1)": {
              marginLeft: (t) => t.spacing(1),
              display: "flex",
              verticalAlign: "center",
              alignItems: "center",
              textDecoration: "none",

              "> h2": {
                fontSize: "14px",
                ml: 2,
                fontWeight: 700,
                letterSpacing: "0.05rem",
                color: "var(--joy-palette-neutral-plainColor)",
              },

              "> svg": {
                width: "25px",
                height: "25px",
                fill: "var(--joy-palette-primary-plainColor)",
              },
            },

            ".children": {
              flex: 1,
              pl: 2,
              display: "flex",
            },

            [`.${iconButtonClasses.root}`]: {
              border: "none",
              margin: 0,
              flex: 0,
              padding: 0,

              "& svg ": {
                fontSize: "20px",
                color: (t) => t.vars.palette.text.primary,
              },

              "&:hover svg": {
                color: (t) => t.vars.palette.primary.plainColor,
              },
            },

            ".hamburger": {
              display: { xs: "flex", sm: "none" },
            },

            ...(borderStyle === "shadow"
              ? {
                  boxShadow: (t) => t.shadow.md,
                }
              : {
                  borderBottom: "1px solid",
                  borderBottomColor: (t) =>
                    t.vars.palette.neutral.outlinedBorder,
                }),
          }}
        >
          {!removeLogo && (
            <Link href="/">
              <AppLogo />
              <h2>CHAIR FLIGHT</h2>
            </Link>
          )}
          <Box className="children">
            <NoSsr>{children}</NoSsr>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {!removeGithub && (
            <IconButton component={Link} target="_blank" href={GITHUB_URL}>
              <GithubIcon />
            </IconButton>
          )}
          {!removeTheme && (
            <IconButton onClick={toggleTheme}>
              {showDarkModeButton ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          )}
          {!removeHamburger && (
            <IconButton onClick={onHamburgerClick} className="hamburger">
              <HamburgerIcon />
            </IconButton>
          )}
        </Box>
        <Box
          className="header-companion"
          sx={{
            height: `var(${VAR_HEADER_HEIGHT})`,
            width: "100%",
            content: '""',
          }}
        />
      </>
    );
  },
) as HeaderComponent;

Header.css = {
  headerHeight: `var(${VAR_HEADER_HEIGHT})`,
};

Header.displayName = "Header";
