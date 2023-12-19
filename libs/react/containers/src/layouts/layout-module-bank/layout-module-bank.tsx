import { type FunctionComponent } from "react";
import { useRouter } from "next/router";
import { default as HomeIcon } from "@mui/icons-material/ConnectingAirportsOutlined";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as LearningObjectivesIcon } from "@mui/icons-material/ListOutlined";
import { default as QuestionsIcon } from "@mui/icons-material/QuizOutlined";
import { default as SettingsIcon } from "@mui/icons-material/SettingsOutlined";
import { Box, listItemContentClasses } from "@mui/joy";
import {
  AppLogo,
  Sidebar,
  SidebarListItem,
} from "@chair-flight/react/components";
import { GlobalColorScheme } from "../global-color-scheme";
import type { QuestionBankName } from "@chair-flight/base/types";

export type LayoutModuleProps = {
  children: React.ReactNode;
  questionBank: QuestionBankName;
  fixedHeight?: boolean;
  noPadding?: boolean;
};

export const LayoutModuleBank: FunctionComponent<LayoutModuleProps> = ({
  children,
  fixedHeight,
  noPadding,
  questionBank,
}) => {
  const router = useRouter();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isSettings = router.asPath.includes("settings");
  const isLearningObjectives = router.asPath.includes("learning-objectives");
  const isHome = !isQuestions && !isTests && !isSettings;

  const supportsLearningsObjectives = questionBank === "atpl";

  return (
    <>
      <GlobalColorScheme module={questionBank} />
      <Sidebar sx={{ height: "100vh" }}>
        <SidebarListItem
          href={"/"}
          icon={AppLogo}
          title={"Chair Flight"}
          sx={{
            height: (t) => t.spacing(6),
            pl: 0.5,
            svg: {
              fill: (t) => t.vars.palette.primary.plainColor,
              fontSize: { xs: 18, sm: 24 },
              marginLeft: { xs: "2px", sm: "-2px" },
            },
            [`& .${listItemContentClasses.root}`]: {
              fontWeight: 700,
              letterSpacing: "0.05rem",
              color: (t) => t.vars.palette.text.primary,
            },
          }}
        />
        <SidebarListItem
          href={`/modules/${questionBank}`}
          selected={isHome}
          icon={HomeIcon}
          title={"Home"}
        />
        <SidebarListItem
          href={`/modules/${questionBank}/tests`}
          selected={isTests}
          icon={TestIcon}
          title={"Tests"}
        />
        <SidebarListItem
          href={`/modules/${questionBank}/questions`}
          selected={isQuestions}
          icon={QuestionsIcon}
          title={"Questions"}
        />
        {supportsLearningsObjectives && (
          <SidebarListItem
            href={"/modules/atpl/learning-objectives"}
            selected={isLearningObjectives}
            icon={LearningObjectivesIcon}
            title={"Learning Objectives"}
          />
        )}
        <SidebarListItem
          bottom
          href={`/modules/${questionBank}/settings`}
          selected={isSettings}
          icon={SettingsIcon}
          title={"Settings"}
        />
      </Sidebar>
      <Box
        component={"main"}
        children={children}
        sx={{
          width: Sidebar.css.remainingWidth,
          transition: Sidebar.css.widthTransition,
          marginLeft: "auto",
          ...(noPadding ? { p: 0 } : { p: { xs: 1, sm: 2 } }),
          ...(fixedHeight ? { height: "100vh" } : {}),
        }}
      />
    </>
  );
};
