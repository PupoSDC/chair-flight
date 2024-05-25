import { default as NextLink } from "next/link";
import { keyframes } from "@emotion/react";
import { NoSsr } from "@mui/base";
import { default as BugReportIcon } from "@mui/icons-material/BugReport";
import { default as CopyIcon } from "@mui/icons-material/ContentPasteOutlined";
import { default as DarkModeIcon } from "@mui/icons-material/DarkMode";
import { default as GithubIcon } from "@mui/icons-material/GitHub";
import { default as LightModeIcon } from "@mui/icons-material/LightMode";
import { default as HamburgerIcon } from "@mui/icons-material/Menu";
import { default as NotificationIcon } from "@mui/icons-material/NotificationsNoneOutlined";
import { Link, IconButton, styled, Tooltip, Stack } from "@mui/joy";
import { DateTime } from "luxon";
import { useColorScheme } from "@cf/react/theme";
import { toast, useSidebar } from "@cf/react/web";
import { trpc } from "@cf/trpc/client";
import { useBugReportDisclose } from "../_hooks/use-bug-report";
import { useTrackEvent } from "../_hooks/use-track-event";
import { useUserVoyage } from "../_hooks/use-user-voyage";
import type { FunctionComponent } from "react";

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

export const SidebarHamburgerButton: FunctionComponent = () => (
  <Tooltip title="Open Sidebar Menu">
    <IconButton
      sx={{ display: { xs: "flex", sm: "none" } }}
      onClick={useSidebar().openSidebar}
    >
      <HamburgerIcon />
    </IconButton>
  </Tooltip>
);

export const ThemeButton: FunctionComponent = () => {
  const { mode, setMode } = useColorScheme();
  const trackEvent = useTrackEvent();

  const toggleTheme = () => {
    trackEvent("themeButton.switch", {});
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <Tooltip title={<NoSsr>{`Switch to ${mode} mode`}</NoSsr>}>
      <IconButton onClick={toggleTheme}>
        <DarkModeIcon className="dark-only" />
        <LightModeIcon className="light-only" />
      </IconButton>
    </Tooltip>
  );
};

export const NotificationButton: FunctionComponent = () => {
  const getDateOfLastPost = trpc.blog.getDateOfLastPost;
  const { data } = getDateOfLastPost.useQuery();
  const [userVoyage] = useUserVoyage();

  const hasNewPosts =
    data?.lastPostDate &&
    DateTime.fromISO(userVoyage.lastBlogVisit) <
      DateTime.fromJSDate(data.lastPostDate);
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
};

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

export const AppButtonsContainer = styled(Stack)`
  flex-direction: row;
  margin-left: auto;
`;

export const CopyToClipboardButton: FunctionComponent<{
  url: string;
  title: string;
}> = ({ url, title }) => {
  return (
    <Tooltip title={title}>
      <IconButton
        size="sm"
        href={url}
        onClick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(url);
          toast({
            content: "Link copied to clipboard!",
          });
        }}
        component={NextLink}
      >
        <CopyIcon />
      </IconButton>
    </Tooltip>
  );
};
