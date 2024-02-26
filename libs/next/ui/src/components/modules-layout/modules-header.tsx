"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, Link, Typography } from "@mui/joy";
import { Sidebar } from "@cf/react/ui";
import {
  AppHeader,
  AppButtonsContainer,
  BugReportButton,
  GithubButton,
  HamburgerButton,
  ThemeButton,
} from "../app-layout";

export const ModulesHeader = () => {
  // TODO remove cast after migrating to APP dir
  const pathName = usePathname() as string;

  const breadcrumbs = pathName
    .split("/")
    .filter(Boolean)
    .map((segment, index) => {
      const url = pathName
        .split("/")
        .slice(0, index + 2)
        .join("/");
      const name = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return { name, url };
    });

  const lastBreadcrumb = breadcrumbs?.at(-1);

  return (
    <AppHeader
      sx={{
        backgroundColor: "background.surface",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "divider",
        width: Sidebar.css.remainingWidth,
        transition: Sidebar.css.widthTransition,
        right: 0,
      }}
    >
      <Breadcrumbs separator="›" sx={{ px: 0 }}>
        {breadcrumbs
          ?.slice(0, -1)
          .map(({ name, url }) => (
            <Link key={url} href={url} children={name} color="neutral" />
          ))}
        {lastBreadcrumb && <Typography>{lastBreadcrumb.name}</Typography>}
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
