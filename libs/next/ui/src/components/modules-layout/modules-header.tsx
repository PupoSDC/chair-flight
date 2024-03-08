"use client";

import { usePathname } from "next/navigation";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Breadcrumbs, Link, Stack, Typography } from "@mui/joy";
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
  const secondLastBreadcrumb = breadcrumbs?.at(-2);

  return (
    <AppHeader
      sx={{
        backgroundColor: "background.surface",
        borderBottomStyle: "solid",
        borderBottomWidth: 1,
        borderBottomColor: "divider",
        width: Sidebar.css.remainingWidth,
        transition: Sidebar.css.widthTransition,
        boxShadow: "none",
        right: 0,
      }}
    >
      <Stack
        component="nav"
        direction="row"
        alignItems="center"
        sx={{ display: { xs: "flex", sm: "none" } }}
      >
        {secondLastBreadcrumb && (
          <Link
            href={secondLastBreadcrumb?.url}
            children={<ChevronLeftIcon />}
            level={"h3"}
            color="neutral"
          />
        )}
        {lastBreadcrumb && <Typography>{lastBreadcrumb.name}</Typography>}
      </Stack>
      <Breadcrumbs separator="›" sx={{ display: { xs: "none", md: "flex" } }}>
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
