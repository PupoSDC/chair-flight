import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, sql } from "drizzle-orm";
import {
  atplLearningObjectives as learningObjectives,
  atplSubjects as subjects,
} from "../../database";
import { QUESTION_BANKS } from "../../libs/core/question-banks/question-banks";
import { getSupabaseDb } from "../../libs/providers/supabase-db";
import { App, Sidebar } from "../../libs/ui/components/base/app-shell";
import { Breadcrumbs } from "../../libs/ui/components/base/breadcrumbs";
import { ThemeToggle } from "../../libs/ui/components/base/theme-toggle";
import { AccountButton } from "../../libs/ui/components/community/account-button";
import { useTheme } from "../../libs/ui/hooks/use-theme";
import { CreateTestIcon } from "../../libs/ui/icons/create-test-icon";
import { HangarIcon } from "../../libs/ui/icons/hangar-icon";
import { LayersIcon } from "../../libs/ui/icons/layers-icon";
import { MoonIcon } from "../../libs/ui/icons/moon-icon";
import { QuestionCardsIcon } from "../../libs/ui/icons/question-cards-icon";
import { SunIcon } from "../../libs/ui/icons/sun-icon";
import { CessnaProfile } from "../../libs/ui/outlines/cessna-profile";
import { cn } from "../../libs/ui/utils/cn";
import { countLearningObjectiveQuestions } from "../-server-functions/atpl-learning-objectives/count-learning-objective-questions";
import type { FC } from "react";
import type { Breadcrumb } from "../../libs/ui/components/base/breadcrumbs";

const loadAtplSubjects = createServerFn({ method: "GET" }).handler(async () => {
  const db = getSupabaseDb();
  const [subjectRows, chapterRows] = await Promise.all([
    db.select().from(subjects).orderBy(asc(subjects.id)),
    db
      .select({
        id: learningObjectives.id,
        subject: learningObjectives.subject,
        text: learningObjectives.text,
        numberOfQuestions: countLearningObjectiveQuestions(),
      })
      .from(learningObjectives)
      .where(
        sql`array_length(string_to_array(${learningObjectives.id}, '.'), 1) in (2, 3)`,
      )
      .orderBy(asc(learningObjectives.id)),
  ]);
  return subjectRows.map((subject) => {
    const subjectRowsOnly = chapterRows.filter(
      (lo) => lo.subject === subject.id && lo.numberOfQuestions > 0,
    );
    return {
      ...subject,
      chapters: subjectRowsOnly
        .filter((lo) => lo.id.split(".").length === 2)
        .map((chapter) => ({
          ...chapter,
          sections: subjectRowsOnly.filter(
            (lo) =>
              lo.id.split(".").length === 3 &&
              lo.id.startsWith(`${chapter.id}.`),
          ),
        })),
    };
  });
});

const ModuleAtplLayout: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const matches = useMatches();
  const home = matches.some((match) => {
    return match.routeId === "/(atpl)/modules/atpl/";
  });
  const page = matches.findLast((match) => match.staticData.breadcrumbs);

  const breadcrumbs: Breadcrumb[] = [
    { label: "ATPL", link: { to: "/modules/atpl" } },
    ...(page?.staticData.breadcrumbs?.({
      params: page.params as Record<string, string>,
      loaderData: page.loaderData,
    }) ?? []),
  ];

  const navItems = [
    {
      to: "/modules/atpl",
      label: "Home",
      icon: HangarIcon,
    },
    {
      to: "/modules/atpl/create-test",
      label: "Create test",
      icon: CreateTestIcon,
    },
    {
      to: "/modules/atpl/questions",
      label: "Questions",
      icon: QuestionCardsIcon,
    },
    {
      to: "/modules/atpl/learning-objectives",
      label: "Learning Objectives",
      icon: LayersIcon,
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
            "cessna-module",
            "relative isolate h-full min-h-0 overflow-hidden",
          )}
        >
          <div aria-hidden="true" className="cessna-module-chart">
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 1200 800"
              preserveAspectRatio="xMidYMid slice"
              className="size-full"
              fill="none"
            >
              <g stroke="currentColor" strokeWidth="1">
                <g transform="translate(1040 620)">
                  <circle r="150" />
                  <circle r="104" strokeDasharray="3 9" />
                  <circle r="30" />
                  <path d="M0.0 -150.0L0.0 -168.0M26.0 -147.7L27.1 -153.6M51.3 -141.0L53.4 -146.6M75.0 -129.9L81.0 -140.3M96.4 -114.9L100.3 -119.5M114.9 -96.4L119.5 -100.3M129.9 -75.0L140.3 -81.0M141.0 -51.3L146.6 -53.4M147.7 -26.0L153.6 -27.1M150.0 -0.0L168.0 -0.0M147.7 26.0L153.6 27.1M141.0 51.3L146.6 53.4M129.9 75.0L140.3 81.0M114.9 96.4L119.5 100.3M96.4 114.9L100.3 119.5M75.0 129.9L81.0 140.3M51.3 141.0L53.4 146.6M26.0 147.7L27.1 153.6M0.0 150.0L0.0 168.0M-26.0 147.7L-27.1 153.6M-51.3 141.0L-53.4 146.6M-75.0 129.9L-81.0 140.3M-96.4 114.9L-100.3 119.5M-114.9 96.4L-119.5 100.3M-129.9 75.0L-140.3 81.0M-141.0 51.3L-146.6 53.4M-147.7 26.0L-153.6 27.1M-150.0 0.0L-168.0 0.0M-147.7 -26.0L-153.6 -27.1M-141.0 -51.3L-146.6 -53.4M-129.9 -75.0L-140.3 -81.0M-114.9 -96.4L-119.5 -100.3M-96.4 -114.9L-100.3 -119.5M-75.0 -129.9L-81.0 -140.3M-51.3 -141.0L-53.4 -146.6M-26.0 -147.7L-27.1 -153.6" />
                  <path d="M-190 0h380M0 -190v380" strokeDasharray="3 9" />
                  <path d="m0 -60 14 30h-28Z" />
                </g>
                <rect
                  x="90"
                  y="90"
                  width="460"
                  height="190"
                  rx="95"
                  strokeDasharray="5 10"
                />
                <path d="M170 185h300" />
                <path d="M170 165h300v40H170Z" />
                <path d="M190 185h260" strokeDasharray="14 10" />
                <path d="m300 94 14-6v12Zm0 183-14-6v12Z" />
                <path
                  d="M-80 520C160 520 220 420 420 460S720 640 900 560"
                  strokeDasharray="2 8"
                />
                <path d="m890 566 12-14 8 16Z" />
                <circle cx="150" cy="700" r="60" />
                <circle cx="150" cy="700" r="100" strokeDasharray="3 9" />
                <path d="M30 700h240M150 580v240" strokeDasharray="3 9" />
              </g>
            </svg>
          </div>
          <CessnaProfile className="aircraft-module-outline" />
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

export const Route = createFileRoute("/(atpl)/modules/atpl")({
  component: ModuleAtplLayout,
  staleTime: Number.POSITIVE_INFINITY,
  loader: () => loadAtplSubjects(),
  head: () => ({
    meta: [{ title: `${QUESTION_BANKS.atpl.title} · Chair Flight` }],
  }),
});
