"use client";

import { useEffect, useState } from "react";
import { keyframes } from "@emotion/react";
import { default as BugReportIcon } from "@mui/icons-material/BugReport";
import { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as LightModeIcon } from "@mui/icons-material/LightMode";
import { default as HamburgerIcon } from "@mui/icons-material/Menu";
import { default as NotificationIcon } from "@mui/icons-material/NotificationsNoneOutlined";
import { Link, IconButton, useColorScheme, Tooltip, Stack } from "@mui/joy";
import { DateTime } from "luxon";
import { useBugReportDisclose } from "@cf/next/user";
import { useSidebar, noSsr } from "@cf/react/ui";
import type { FunctionComponent, ReactNode } from "react";

const GITHUB_URL = "https://github.com/PupoSDC/chair-flight";

const pulseAnimation = keyframes`
  0%, 100% { color: var(--joy-palette-primary-500); }
  50% { color: var(--joy-palette-text-icon) };
`;

export const GithubButton: FunctionComponent = () => (
  <Tooltip title="Github">
    <IconButton component={Link} target="_blank" href={GITHUB_URL}>
      <GithubIcon />
    </IconButton>
  </Tooltip>
);

export const HamburgerButton: FunctionComponent = () => (
  <Tooltip title="Open Sidebar Menu">
    <IconButton
      sx={{ display: { xs: "flex", sm: "none" } }}
      onClick={useSidebar().openSidebar}
    >
      <HamburgerIcon />
    </IconButton>
  </Tooltip>
);

export const ThemeButton: FunctionComponent = noSsr(
  () => {
    const [isMounted, setIsMounted] = useState(false);
    const { mode, setMode } = useColorScheme();
    // const trackEvent = useTrackEvent();
    const showDarkModeButton = !isMounted || mode === "light";

    const toggleTheme = () => {
      // trackEvent("themeButton.switch", {});
      setMode(mode === "dark" ? "light" : "dark");
    };

    useEffect(() => setIsMounted(true), []);

    return (
      <Tooltip title={`Switch to ${mode} mode`}>
        <IconButton onClick={toggleTheme}>
          {showDarkModeButton ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
      </Tooltip>
    );
  },
  () => (
    <Tooltip title={`Switch theme`}>
      <IconButton disabled>
        <LightModeIcon />
      </IconButton>
    </Tooltip>
  ),
);

/** TODO not developed */
export const NotificationButton: FunctionComponent = noSsr(
  () => {
    // const getDateOfLastPost = trpc.blog.getDateOfLastPost;
    // const [{ lastPostDate }] = getDateOfLastPost.useSuspenseQuery();
    // const [userVoyage] = useUserVoyage();
    const userVoyage = { lastBlogVisit: "2021-10-10" };
    const lastPostDate = "2021-10-11";

    const hasNewPosts =
      DateTime.fromISO(userVoyage.lastBlogVisit) <
      DateTime.fromISO(lastPostDate);
    const animation = hasNewPosts ? `${pulseAnimation} 2s infinite` : undefined;
    const tooltipTitle = hasNewPosts
      ? "New Posts available in our blog!"
      : "Blog";

    return (
      <Tooltip title={tooltipTitle}>
        <IconButton component={Link} href={"/articles/blog"}>
          <NotificationIcon sx={{ animation }} />
        </IconButton>
      </Tooltip>
    );
  },
  () => (
    <Tooltip title={"Blog"}>
      <IconButton component={Link} href={"/articles/blog"}>
        <NotificationIcon />
      </IconButton>
    </Tooltip>
  ),
);

export const BugReportButton: FunctionComponent = () => {
  const bugReport = useBugReportDisclose();
  return (
    <Tooltip title="Submit a bug report">
      <IconButton onClick={bugReport.open}>
        <BugReportIcon />
      </IconButton>
    </Tooltip>
  );
};

export const AppButtonsContainer: FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => (
  <Stack
    sx={{
      flexDirection: "row",
      marginLeft: "auto",
      gap: 0.5,
      justifyContent: "space-between",

      "& > *": {
        p: 0,
        minWidth: { xs: "22px", sm: "36px" },
        minHeight: { xs: "22px", sm: "36px" },
        width: { xs: "22px", sm: "36px" },
        height: { xs: "22px", sm: "36px" },
      },
      [`& svg`]: {
        width: { xs: "18px", sm: "24px" },
        height: { xs: "18px", sm: "24px" },
      },
    }}
  >
    {children}
  </Stack>
);
