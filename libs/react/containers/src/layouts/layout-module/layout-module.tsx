import { useRouter } from "next/router";
import { default as HomeIcon } from "@mui/icons-material/ConnectingAirportsOutlined";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as LearningObjectivesIcon } from "@mui/icons-material/ListOutlined";
import { default as QuestionsIcon } from "@mui/icons-material/QuizOutlined";
import { default as SettingsIcon } from "@mui/icons-material/SettingsOutlined";
import { default as CardIcon } from "@mui/icons-material/StyleOutlined";
import { Box, LinearProgress, listItemContentClasses } from "@mui/joy";
import {
  AppLogo,
  Sidebar,
  SidebarListItem,
  ThemeOverrideColorScheme,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { usePageTransition } from "../hooks/use-page-transition";
import type { QuestionBankName } from "@chair-flight/base/types";

type Props = {
  children: React.ReactNode;
  fixedHeight?: boolean;
  noPadding?: boolean;
  questionBank: QuestionBankName;
};

type Params = {
  questionBank: QuestionBankName;
};

type Data = {
  hasFlashcards: boolean;
  hasQuestions: boolean;
  hasLearningObjectives: boolean;
  hasMedia: boolean;
};

export const LayoutModule = container<Props, Params, Data>((props) => {
  const { children, fixedHeight, noPadding, questionBank } = props;
  const { isTransitioning } = usePageTransition();
  const router = useRouter();
  const config = LayoutModule.useData(props);

  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isSettings = router.asPath.includes("settings");
  const isLearningObjectives = router.asPath.includes("learning-objectives");
  const isFlashcards = router.asPath.includes("flashcards");
  const isHome = !isQuestions && !isTests && !isSettings && !isFlashcards;

  return (
    <>
      <ThemeOverrideColorScheme questionBank={questionBank} />
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
        {config.hasQuestions && (
          <SidebarListItem
            href={`/modules/${questionBank}/tests`}
            selected={isTests}
            icon={TestIcon}
            title={"Tests"}
          />
        )}
        {config.hasQuestions && (
          <SidebarListItem
            href={`/modules/${questionBank}/questions`}
            selected={isQuestions}
            icon={QuestionsIcon}
            title={"Questions"}
          />
        )}
        {config.hasLearningObjectives && (
          <SidebarListItem
            href={"/modules/atpl/learning-objectives"}
            selected={isLearningObjectives}
            icon={LearningObjectivesIcon}
            title={"Learning Objectives"}
          />
        )}
        {config.hasFlashcards && (
          <SidebarListItem
            href={"/modules/prep/flashcards"}
            selected={isFlashcards}
            icon={CardIcon}
            title={"Flash Cards"}
            sx={{
              "& svg": {
                transform: "rotate(180deg)",
              },
            }}
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
      <LinearProgress
        sx={{
          "--LinearProgress-radius": 0,
          transition: `bottom ${isTransitioning ? "0.2s" : "0.7s"} ease`,
          position: "fixed",
          bottom: isTransitioning ? 0 : -6,
          right: "-5%",
          width: `calc(${Sidebar.css.remainingWidth} + 10%)`,
          zIndex: 1000,
        }}
      />
    </>
  );
});

LayoutModule.displayName = "LayoutModule";

LayoutModule.getData = async ({ helper, params }) => {
  const questionBank = getRequiredParam(params, "questionBank");
  return await helper.questionBank.getConfig.fetch({ questionBank });
};

LayoutModule.useData = (params) => {
  const qb = trpc.questionBank;
  const questionBank = getRequiredParam(params, "questionBank");
  return qb.getConfig.useSuspenseQuery({ questionBank })[0];
};
