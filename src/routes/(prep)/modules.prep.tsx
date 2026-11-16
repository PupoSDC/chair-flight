import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { formatSlugAsTitle } from "../../libs/base/format-values";
import { QUESTION_BANKS } from "../../libs/core/question-banks/question-banks";
import { App, Sidebar } from "../../libs/ui/components/base/app-shell";
import { Breadcrumbs } from "../../libs/ui/components/base/breadcrumbs";
import { AccountButton } from "../../libs/ui/components/community/account-button";
import { useTheme } from "../../libs/ui/hooks/use-theme";
import { CardsIcon } from "../../libs/ui/icons/cards-icon";
import { HomeIcon } from "../../libs/ui/icons/home-icon";
import { MoonIcon } from "../../libs/ui/icons/moon-icon";
import { SunIcon } from "../../libs/ui/icons/sun-icon";
import type { FC } from "react";
import type { Breadcrumb } from "../../libs/ui/components/base/breadcrumbs";

const NAV_ITEMS = [
  {
    to: "/modules/prep",
    label: "Home",
    icon: HomeIcon,
    requires: null,
  },
  {
    to: "/modules/prep/flashcards",
    label: "Flashcards",
    icon: CardsIcon,
    requires: "hasFlashcards",
  },
] as const;

const ModuleLayout: FC = () => {
  const questionBank = "prep" as const;
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const bank = QUESTION_BANKS[questionBank];
  const [section, item] = pathname.split("/").slice(3);
  const sectionLabel = formatSlugAsTitle(section ?? "");
  const sectionLink = NAV_ITEMS.find(
    (navItem) => navItem.to.split("/")[3] === section,
  )?.to;
  const breadcrumbs: Breadcrumb[] = [
    { label: bank.shortTitle, link: { to: "/modules/prep" } },
    ...(section
      ? [
          {
            label: sectionLabel,
            link: item && sectionLink ? { to: sectionLink } : undefined,
          },
        ]
      : []),
    ...(item
      ? [{ label: item === "create" ? "Create" : decodeURIComponent(item) }]
      : []),
  ];

  return (
    <App>
      <App.Sidebar>
        <App.Logo />
        {NAV_ITEMS.filter(
          (navItem) => !navItem.requires || bank[navItem.requires],
        ).map((navItem) => (
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
          onClick={toggleTheme}
        />
        <AccountButton variant="sidebar" />
        <Sidebar.Collapse />
      </App.Sidebar>
      <App.Header>
        <Breadcrumbs items={breadcrumbs} />
        <App.Menu />
      </App.Header>
      <App.Main>
        <Outlet />
      </App.Main>
    </App>
  );
};

export const Route = createFileRoute("/(prep)/modules/prep")({
  staleTime: Number.POSITIVE_INFINITY,
  head: () => ({
    meta: [{ title: `${QUESTION_BANKS.prep.title} · Chair Flight` }],
  }),
  component: ModuleLayout,
});
