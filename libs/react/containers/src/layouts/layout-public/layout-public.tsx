import { Box, LinearProgress, Link, Stack } from "@mui/joy";
import { AppLogo } from "@chair-flight/react/components";
import { container } from "../../wraper/container";
import {
  AppButtonsContainer,
  GithubButton,
  ThemeButton,
} from "../components/app-buttons";
import { usePageTransition } from "../hooks/use-page-transition";
import type { ReactElement } from "react";

const HEADER_HEIGHT = 48;
const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

type Props = {
  children: React.ReactNode;
  fixedHeight?: boolean;
  background?: ReactElement;
  noPadding?: boolean;
  component?: undefined;
  sx?: undefined;
};

export const LayoutPublic = container<Props>(
  ({ children, fixedHeight, background, noPadding }) => {
    const { isTransitioning } = usePageTransition();

    return (
      <>
        <Stack
          component="header"
          sx={{
            flexDirection: "row",
            color: "text.primary",
            width: "100%",
            position: "fixed",
            alignItems: "center",
            justifyContent: "space-between",
            height: `${HEADER_HEIGHT}px`,
            padding: (t) => t.spacing(0, 1),
            backgroundColor: "neutral.plainHoverBg",
            zIndex: 1000,
            boxShadow: (t) => t.shadow.md,

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
                color: ({ vars }) => vars.palette.neutral.plainColor,
                display: { xs: "none", sm: "block" },
              },

              "> svg": {
                width: "25px",
                height: "25px",
                fill: ({ vars }) => vars.palette.primary.plainColor,
              },
            },

            "& nav": {
              flex: 1,
              pl: 3,
              display: "flex",
            },
          }}
        >
          <Link href="/">
            <AppLogo />
            <h2>CHAIR FLIGHT</h2>
          </Link>

          <Box component="nav">
            <Link href="/articles/blog" color="neutral" fontSize="sm">
              Blog
            </Link>
          </Box>
          <AppButtonsContainer>
            <GithubButton />
            <ThemeButton />
          </AppButtonsContainer>
        </Stack>
        <Box sx={{ height: HEADER_HEIGHT, width: "100%", content: '""' }} />
        {background}
        <Box
          component="main"
          children={children}
          sx={{
            width: "100%",
            margin: "auto",
            ...(fixedHeight ? { height: HEIGHT } : { minHeight: HEIGHT }),
            ...(noPadding ? {} : { p: { xs: 2, md: 4 } }),
            ...(noPadding ? {} : { maxWidth: "md" }),
          }}
        />
        <LinearProgress
          sx={{
            "--LinearProgress-radius": 0,
            transition: `bottom ${isTransitioning ? "0.2s" : "0.7s"} ease`,
            position: "fixed",
            bottom: isTransitioning ? 0 : -6,
            left: "-5%",
            width: "110%",
            zIndex: 1000,
          }}
        />
      </>
    );
  },
);

LayoutPublic.displayName = "LayoutPublic";
LayoutPublic.getData = async () => ({});
LayoutPublic.useData = () => ({});
