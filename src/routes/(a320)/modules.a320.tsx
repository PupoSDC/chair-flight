import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { App, Sidebar } from "../../libs/ui/components/base/app-shell";
import { Breadcrumbs } from "../../libs/ui/components/base/breadcrumbs";
import { ThemeToggle } from "../../libs/ui/components/base/theme-toggle";
import { AccountButton } from "../../libs/ui/components/community/account-button";
import { useTheme } from "../../libs/ui/hooks/use-theme";
import { CreateTestIcon } from "../../libs/ui/icons/create-test-icon";
import { HangarIcon } from "../../libs/ui/icons/hangar-icon";
import { MoonIcon } from "../../libs/ui/icons/moon-icon";
import { QuestionCardsIcon } from "../../libs/ui/icons/question-cards-icon";
import { SearchIcon } from "../../libs/ui/icons/search-icon";
import { SunIcon } from "../../libs/ui/icons/sun-icon";
import { A320Front } from "../../libs/ui/outlines/a320-front";
import { cn } from "../../libs/ui/utils/cn";
import { getA320ModuleData } from "../-server-functions/question-banks/get-a320-module-data";
import type { FC } from "react";
import type { Breadcrumb } from "../../libs/ui/components/base/breadcrumbs";

const ModuleA320Layout: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const matches = useMatches();
  const home = matches.some((match) => {
    return match.routeId === "/(a320)/modules/a320/";
  });
  const page = matches.findLast((match) => match.staticData.breadcrumbs);

  const breadcrumbs: Breadcrumb[] = [
    { label: "A320", link: { to: "/modules/a320" } },
    ...(page?.staticData.breadcrumbs?.({
      params: page.params as Record<string, string>,
      loaderData: page.loaderData,
    }) ?? []),
  ];

  const navItems = [
    {
      to: "/modules/a320",
      label: "Home",
      icon: HangarIcon,
    },
    {
      to: "/modules/a320/search",
      label: "Search",
      icon: SearchIcon,
    },
    {
      to: "/modules/a320/create-test",
      label: "Create test",
      icon: CreateTestIcon,
    },
    {
      to: "/modules/a320/questions",
      label: "Questions",
      icon: QuestionCardsIcon,
    },
  ] as const;

  return (
    <App>
      <App.Sidebar>
        <App.Logo />
        {navItems.map((navItem) => (
          <Sidebar.Item
            key={navItem.to}
            icon={navItem.icon}
            label={navItem.label}
            link={{ to: navItem.to }}
            exact={navItem.label === "Home"}
          />
        ))}
        <Sidebar.Fill />
        <Sidebar.Button
          icon={theme === "light" ? SunIcon : MoonIcon}
          label={theme === "light" ? "Light mode" : "Dark mode"}
          className="border-t sm:hidden"
          onClick={toggleTheme}
        />
        <AccountButton variant="sidebar" />
        <Sidebar.Collapse />
      </App.Sidebar>
      <App.Header>
        <Breadcrumbs items={breadcrumbs} />
        <ThemeToggle className="max-sm:hidden" />
        <App.Menu />
      </App.Header>
      <App.Main>
        <div
          data-module-home={home}
          className={cn(
            "a320-module",
            "relative isolate h-full min-h-0 overflow-hidden",
          )}
        >
          <div aria-hidden="true" className="a320-module-chart">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              className="size-full"
              fill="none"
            >
              <g stroke="currentColor" strokeWidth="1">
                <circle cx="100" cy="40" r="200" />
                <circle cx="100" cy="40" r="280" />
                <circle cx="100" cy="40" r="360" />
                <path d="M0 40h500M100 0v440" strokeDasharray="3 9" />
                <circle cx="1160" cy="820" r="240" />
                <circle cx="1160" cy="820" r="320" />
                <circle cx="1160" cy="820" r="400" />
                <path
                  d="M-80 410C210 410 300 110 620 110S960 430 1280 430"
                  strokeDasharray="5 10"
                />
                <path d="m610 110 10-10 10 10-10 10Z" />
              </g>
            </svg>
          </div>
          <A320Front className="aircraft-module-outline" />
          <div
            data-scroll-reset
            className="h-full overflow-auto overscroll-contain"
          >
            <Outlet />
          </div>
        </div>
      </App.Main>
    </App>
  );
};

export const Route = createFileRoute("/(a320)/modules/a320")({
  component: ModuleA320Layout,
  loader: () => getA320ModuleData(),
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [{ title: "Chair Flight · A320" }],
  }),
});
