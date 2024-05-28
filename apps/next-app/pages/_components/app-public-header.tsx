import { default as NextLink } from "next/link";
import { Link, Stack } from "@mui/joy";
import { AppLogo, AppTitle } from "@cf/react/web";
import { BugReportButton, GithubButton, ThemeButton } from "./app-buttons";
import type { StackProps } from "@mui/joy";
import type { FunctionComponent } from "react";

export const HEADER_HEIGHT = 48;

export const AppPublicHeader: FunctionComponent<
  Omit<StackProps, "children">
> = ({ component = "header", sx, ...props }) => {
  return (
    <Stack
      component={component}
      sx={{
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        height: `${HEADER_HEIGHT}px`,
        padding: (t) => t.spacing(0, 1),
        borderBottom: "1px solid",
        borderColor: "neutral.outlinedBorder",
        zIndex: 1000,
        ...sx,
      }}
      {...props}
    >
      <Stack
        component={NextLink}
        href="/"
        direction={"row"}
        sx={{ verticalAlign: "center", textDecoration: "none" }}
      >
        <AppLogo color="primary" />
        <AppTitle
          sx={{
            textDecoration: "none",
            ml: 1,
            display: { xs: "none", md: "block" },
          }}
        />
      </Stack>

      <Stack component="nav" sx={{ ml: 2, gap: 1, flexDirection: "row" }}>
        <Link href="/articles/blog" color="neutral" fontSize="sm">
          Blog
        </Link>
        <Link href="/content" color="neutral" fontSize="sm">
          Content
        </Link>
        <Link href="/app" color="neutral" fontSize="sm">
          App
        </Link>
      </Stack>
      <Stack direction={"row"} ml="auto">
        <BugReportButton />
        <GithubButton />
        <ThemeButton />
      </Stack>
    </Stack>
  );
};
