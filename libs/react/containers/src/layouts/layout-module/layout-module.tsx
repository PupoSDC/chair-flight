import { useRouter } from "next/router";
import { NoSsr } from "@mui/base";
import { default as HomeIcon } from "@mui/icons-material/ConnectingAirportsOutlined";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as LearningObjectivesIcon } from "@mui/icons-material/ListOutlined";
import { default as QuestionsIcon } from "@mui/icons-material/QuizOutlined";
import { default as SettingsIcon } from "@mui/icons-material/SettingsOutlined";
import { default as CardIcon } from "@mui/icons-material/StyleOutlined";
import {
  Box,
  Breadcrumbs,
  LinearProgress,
  Link,
  Stack,
  Typography,
  listItemContentClasses,
  useTheme,
} from "@mui/joy";
import {
  AppLogo,
  GithubButton,
  HamburgerButton,
  Sidebar,
  SidebarListItem,
  ThemeButton,
  ThemeOverrideColorScheme,
  useMediaQuery,
  useSidebar,
} from "@chair-flight/react/components";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "../../wraper/container";
import { usePageTransition } from "../hooks/use-page-transition";
import type { QuestionBankName } from "@chair-flight/base/types";

const HEADER_HEIGHT = 48;

export type Breadcrumbs = [
  ...Array<[displayName: string, url: string]>,
  string,
];

type Props = {
  children: React.ReactNode;
  questionBank: QuestionBankName;
  fixedHeight?: boolean;
  noPadding?: boolean;
  breadcrumbs?: Breadcrumbs;
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

export const LayoutModule = container<Props, Params, Data>(
  ({ children, fixedHeight, noPadding, questionBank, breadcrumbs }) => {
    const { isTransitioning } = usePageTransition();
    const { openSidebar } = useSidebar();
    const router = useRouter();
    const config = LayoutModule.useData({ questionBank });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const isQuestions = router.asPath.includes("questions");
    const isTests = router.asPath.includes("tests");
    const isSettings = router.asPath.includes("settings");
    const isLearningObjectives = router.asPath.includes("learning-objectives");
    const isFlashcards = router.asPath.includes("flashcards");
    const isHome =
      !isQuestions &&
      !isTests &&
      !isSettings &&
      !isFlashcards &&
      !isLearningObjectives;

    const secondToLastBreadcrumb = breadcrumbs?.at(-2);
    const lastBreadcrumb = breadcrumbs?.at(-1);

    console.log(secondToLastBreadcrumb);
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
        <Stack
          component="header"
          sx={{
            flexDirection: "row",
            color: "text.primary",

            position: "fixed",
            alignItems: "center",
            justifyContent: "space-between",
            height: `${HEADER_HEIGHT}px`,
            padding: (t) => t.spacing(0, 1),
            backgroundColor: "background.surface",
            borderBottomStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "divider",
            boxSizing: "content-box",
            zIndex: 1000,
            width: Sidebar.css.remainingWidth,
            transition: Sidebar.css.widthTransition,
            right: 0,
          }}
        >
          <NoSsr>
            <Breadcrumbs separator="›" sx={{ ml: 2 }}>
              {isMobile && secondToLastBreadcrumb && (
                <Link href={secondToLastBreadcrumb[1]}>•••</Link>
              )}
              {!isMobile &&
                breadcrumbs?.slice(0, -1).map(([name, url]) => (
                  <Link key={url} color="neutral" href={url}>
                    {name}
                  </Link>
                ))}
              {lastBreadcrumb && <Typography>{lastBreadcrumb}</Typography>}
            </Breadcrumbs>
          </NoSsr>

          <GithubButton sx={{ ml: "auto" }} />
          <ThemeButton />
          <HamburgerButton
            sx={{ display: ["flex", "none"] }}
            onClick={openSidebar}
          />
        </Stack>
        <Box sx={{ height: HEADER_HEIGHT, width: "100%", content: '""' }} />
        <Stack
          component={"main"}
          children={children}
          sx={{
            width: Sidebar.css.remainingWidth,
            transition: Sidebar.css.widthTransition,
            marginLeft: "auto",
            ...(noPadding ? { p: 0 } : { p: { xs: 1, sm: 2 } }),
            ...(fixedHeight
              ? { height: `calc(100vh - ${HEADER_HEIGHT}px)` }
              : {}),
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
  },
);

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
