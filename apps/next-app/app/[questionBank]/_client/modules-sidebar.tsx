"use client";

import { usePathname } from "next/navigation";
import { default as HomeIcon } from "@mui/icons-material/ConnectingAirportsOutlined";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as DocsIcon } from "@mui/icons-material/LibraryBooksOutlined";
import { default as LearningObjectivesIcon } from "@mui/icons-material/ListOutlined";
import { default as AnnexesIcon } from "@mui/icons-material/PanoramaOutlined";
import { default as QuestionsIcon } from "@mui/icons-material/QuizOutlined";
import { default as SettingsIcon } from "@mui/icons-material/SettingsOutlined";
import { default as CardIcon } from "@mui/icons-material/StyleOutlined";
import { listItemContentClasses } from "@mui/joy";
import { AppLogo, Sidebar, SidebarListItem } from "@cf/react/components";
import type { FunctionComponent } from "react";

export type ModulesSidebarRoute = {
  href: string;
  isVisible: boolean;
};

export type ModulesSidebarProps = {
  routes: {
    home: ModulesSidebarRoute;
    questions: ModulesSidebarRoute;
    learningObjectives: ModulesSidebarRoute;
    annexes: ModulesSidebarRoute;
    tests: ModulesSidebarRoute;
    docs: ModulesSidebarRoute;
    flashcards: ModulesSidebarRoute;
    settings: ModulesSidebarRoute;
  };
};

export const ModulesSidebar: FunctionComponent<ModulesSidebarProps> = ({
  routes,
}) => {
  const pathname = usePathname();
  const isQuestions = pathname.includes("questions");
  const isTests = pathname.includes("tests");
  const isSettings = pathname.includes("settings");
  const isLearningObjectives = pathname.includes("learning-objectives");
  const isFlashcards = pathname.includes("flashcards");
  const isAnnexes = pathname.includes("annexes");
  const isDocs = pathname.includes("docs");
  const isHome =
    !isQuestions &&
    !isTests &&
    !isSettings &&
    !isFlashcards &&
    !isDocs &&
    !isLearningObjectives &&
    !isAnnexes;

  return [
    <Sidebar sx={{ height: "100vh" }}>
      <SidebarListItem
        href={"/"}
        key="logo"
        icon={AppLogo}
        title=""
        sx={{
          height: (t) => t.spacing(6),
          pl: 0.5,
          svg: {
            fill: (t) => t.vars.palette.primary.plainColor,
            fontSize: 24,
            marginLeft: "-2px",
          },
          [`& .${listItemContentClasses.root}`]: {
            fontWeight: 700,
            letterSpacing: "0.05rem",
            color: (t) => t.vars.palette.text.primary,
          },
        }}
      />
      {routes.home.isVisible && (
        <SidebarListItem
          key="home"
          title="Home"
          href={routes.home.href}
          selected={isHome}
          icon={HomeIcon}
        />
      )}
      {routes.tests.isVisible && (
        <SidebarListItem
          key="tests"
          title="Tests"
          href={routes.tests.href}
          selected={isTests}
          icon={TestIcon}
        />
      )}
      {routes.questions.isVisible && (
        <SidebarListItem
          key="questions"
          title="Questions"
          href={routes.questions.href}
          selected={isQuestions}
          icon={QuestionsIcon}
        />
      )}
      {routes.docs.isVisible && (
        <SidebarListItem
          key="docs"
          title="Docs"
          href={routes.docs.href}
          selected={isDocs}
          icon={DocsIcon}
        />
      )}
      {routes.learningObjectives.isVisible && (
        <SidebarListItem
          key="learningObjectives"
          title="Learning Objectives"
          href={routes.learningObjectives.href}
          selected={isLearningObjectives}
          icon={LearningObjectivesIcon}
        />
      )}
      {routes.annexes.isVisible && (
        <SidebarListItem
          key="annexes"
          title="Annexes"
          href={routes.annexes.href}
          selected={isAnnexes}
          icon={AnnexesIcon}
        />
      )}
      {routes.flashcards.isVisible && (
        <SidebarListItem
          key="flashcards"
          title="Flash Cards"
          href={routes.flashcards.href}
          selected={isFlashcards}
          icon={CardIcon}
          sx={{ "& svg": { transform: "rotate(180deg)" } }}
        />
      )}
      {routes.settings.isVisible && (
        <SidebarListItem
          bottom
          key="settings"
          title="Settings"
          href={routes.settings.href}
          selected={isSettings}
          icon={SettingsIcon}
        />
      )}
    </Sidebar>,
  ];
};
