"use client";

import { Breadcrumbs, Link, Typography, useTheme } from "@mui/joy";
import {
  AppButtonsContainer,
  BugReportButton,
  GithubButton,
  HamburgerButton,
  ThemeButton,
} from "@cf/next/user";
import { AppHeader, Sidebar, useMediaQuery } from "@cf/react/components";

export const ModulesHeader = () => {
  const breadcrumbs = [
    ["Home", "/questionBank"],
    ["Questions", "/questionBank/questions"],
    "Question 1",
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const secondToLastBreadcrumb = breadcrumbs?.at(-2);
  const lastBreadcrumb = breadcrumbs?.at(-1);

  return (
    <AppHeader
      sx={{
        boxSizing: "content-box",
        backgroundColor: "background.surface",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "divider",
        width: Sidebar.css.remainingWidth,
        transition: Sidebar.css.widthTransition,
        right: 0,
      }}
    >
      <Breadcrumbs separator="›" sx={{ ml: 2 }}>
        {isMobile && secondToLastBreadcrumb && (
          <Link href={secondToLastBreadcrumb[1]}>•••</Link>
        )}
        {!isMobile &&
          breadcrumbs?.slice(0, -1).map(([name, url]) => (
            <Link key={url} color="neutral" href={url}>
              {name}
            </Link>
          ))}
        {lastBreadcrumb && <Typography>{lastBreadcrumb}</Typography>}
      </Breadcrumbs>
      <AppButtonsContainer>
        <BugReportButton />
        <GithubButton />
        <ThemeButton />
        <HamburgerButton />
      </AppButtonsContainer>
    </AppHeader>
  );
};
