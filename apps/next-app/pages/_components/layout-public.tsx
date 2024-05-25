import { Box, LinearProgress, Link, Stack, Typography } from "@mui/joy";
import { AppLogo } from "@cf/react/web";
import { usePageTransition } from "@cf/react/web";
import {
  AppButtonsContainer,
  BugReportButton,
  GithubButton,
  ThemeButton,
} from "./app-buttons";
import type { SxProps } from "@mui/joy/styles/types";
import type { FunctionComponent, ReactElement } from "react";

const HEADER_HEIGHT = 48;
const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

export const LayoutPublic: FunctionComponent<{
  children: React.ReactNode;
  fixedHeight?: boolean;
  background?: ReactElement;
  noPadding?: boolean;
  sx?: {
    main?: SxProps;
    header?: SxProps;
  };
}> = ({ children, fixedHeight, background, noPadding, sx }) => {
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

          ...sx?.header,
        }}
      >
        <Link href="/">
          <AppLogo />
          <h2>CHAIR FLIGHT</h2>
        </Link>

        <Box component="nav" gap={2}>
          <Link href="/articles/blog" color="neutral" fontSize="sm">
            Blog
          </Link>
          <Link href="/content" color="neutral" fontSize="sm">
            Content
          </Link>
          <Link href="/app" color="neutral" fontSize="sm">
            App
          </Link>
        </Box>
        <AppButtonsContainer>
          <BugReportButton />
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

          ...sx?.main,
        }}
      />
      <Stack component="footer" alignItems="center">
        <AppLogo sx={{ width: 52, height: 52, my: 2 }} color="primary" />

        <Stack
          gap={2}
          alignItems={"center"}
          sx={{ my: 2 }}
          direction={{ md: "row" }}
        >
          <Link href={"/blog"}>Github</Link>
          <Link href={"/content"}>Content</Link>
          <Link href={"/blog"}>Blog</Link>
          <Link href={"/about-us"}>About Us</Link>
        </Stack>
        <Typography sx={{ my: 2 }}>
          Chair Flight is a community driven Aviation Question Bank built by
          students for students.
        </Typography>
      </Stack>
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
};
