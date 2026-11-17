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
import { StudentNotesIcon } from "../../libs/ui/icons/student-notes-icon";
import { SunIcon } from "../../libs/ui/icons/sun-icon";
import { B737Front } from "../../libs/ui/outlines/b737-front";
import { cn } from "../../libs/ui/utils/cn";
import { getB737ModuleData } from "../-server-functions/question-banks/get-b737-module-data";
import type { FC } from "react";
import type { Breadcrumb } from "../../libs/ui/components/base/breadcrumbs";

const ModuleB737Layout: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const matches = useMatches();
  const home = matches.some((match) => {
    return match.routeId === "/(b737)/modules/b737/";
  });
  const page = matches.findLast((match) => match.staticData.breadcrumbs);

  const breadcrumbs: Breadcrumb[] = [
    { label: "737", link: { to: "/modules/b737" } },
    ...(page?.staticData.breadcrumbs?.({
      params: page.params as Record<string, string>,
      loaderData: page.loaderData,
    }) ?? []),
  ];

  const navItems = [
    {
      to: "/modules/b737",
      label: "Home",
      icon: HangarIcon,
    },
    {
      to: "/modules/b737/search",
      label: "Search",
      icon: SearchIcon,
    },
    {
      to: "/modules/b737/create-test",
      label: "Create test",
      icon: CreateTestIcon,
    },
    {
      to: "/modules/b737/questions",
      label: "Questions",
      icon: QuestionCardsIcon,
    },
    {
      to: "/modules/b737/docs",
      label: "Student notes",
      icon: StudentNotesIcon,
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
            "b737-module",
            "relative isolate h-full min-h-0 overflow-hidden",
          )}
        >
          <div aria-hidden="true" className="b737-module-chart">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              className="size-full"
              fill="none"
            >
              <g stroke="currentColor" strokeWidth="1">
                <circle cx="1100" cy="80" r="180" />
                <circle cx="1100" cy="80" r="260" />
                <circle cx="1100" cy="80" r="340" />
                <path d="M720 80h480M1100 0v460" strokeDasharray="3 9" />
                <circle cx="100" cy="800" r="220" />
                <circle cx="100" cy="800" r="300" />
                <circle cx="100" cy="800" r="380" />
                <path
                  d="M-80 640C220 640 220 180 620 180S980 420 1280 200"
                  strokeDasharray="5 10"
                />
                <path d="m610 180 10-10 10 10-10 10Z" />
              </g>
            </svg>
          </div>
          <B737Front className="aircraft-module-outline" />
          <div
            data-scroll-reset
            className="h-full overflow-auto overscroll-none"
          >
            <Outlet />
          </div>
        </div>
      </App.Main>
    </App>
  );
};

export const Route = createFileRoute("/(b737)/modules/b737")({
  component: ModuleB737Layout,
  staleTime: Number.POSITIVE_INFINITY,
  loader: () => getB737ModuleData(),
  head: () => ({
    meta: [{ title: "Chair Flight · 737" }],
  }),
});
