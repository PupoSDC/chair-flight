import { Box, Divider, Link, Stack } from "@mui/joy";
import {
  BugReportButton,
  AppButtonsContainer,
  GithubButton,
  ThemeButton,
} from "@cf/next/user";
import { AppLogo } from "@cf/react/components";
import type { FunctionComponent } from "react";

const HEADER_HEIGHT = 48;

type LayoutProps = {
  children: React.ReactNode;
};

const LayoutPublic: FunctionComponent<LayoutProps> = ({ children }) => {
  // const { isTransitioning } = usePageTransition();

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
          px: 1,
          py: 0,
          backgroundColor: "neutral.plainHoverBg",
          zIndex: 1000,
          boxShadow: "md",

          "& > a:nth-of-type(1)": {
            ml: 1,
            display: "flex",
            verticalAlign: "center",
            alignItems: "center",
            textDecoration: "none",

            "> h2": {
              fontSize: "14px",
              ml: 2,
              fontWeight: 700,
              letterSpacing: "0.05rem",
              color: "neutral.plainColor",
              display: { xs: "none", sm: "block" },
            },

            "> svg": {
              width: "25px",
              height: "25px",
              fill: "var(--joy-palette-primary-plainColor)",
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
          <BugReportButton />
          <GithubButton />
          <ThemeButton />
        </AppButtonsContainer>
      </Stack>
      <Box sx={{ height: HEADER_HEIGHT, width: "100%", content: '""' }} />
      {children}
      <Stack component="footer">
        <Divider sx={{ mt: 4, mb: 2 }} />
        <Stack
          direction={"row"}
          gap={2}
          mt={2}
          mb={4}
          mx={"auto"}
          maxWidth={"lg"}
          width={"100%"}
        >
          <Link href={"/blog"} level="body-sm">
            Github
          </Link>
          <Link href={"/blog"} level="body-sm">
            Blog
          </Link>
          <Link href={"/about-us"} level="body-sm">
            About Chair Flight
          </Link>
        </Stack>
      </Stack>
    </>
  );
  /**
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
                    <BugReportButton />
                    <GithubButton />
                    <ThemeButton />
                </AppButtonsContainer>
            </Stack>
            <Box sx={{ height: HEADER_HEIGHT, width: "100%", content: '""' }} />
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
         <UserBugReport />
        </>
    ); */
};

export default LayoutPublic;
