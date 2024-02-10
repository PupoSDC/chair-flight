import { useRouter } from "next/router";
import { NoSsr } from "@mui/base";
import { default as HomeIcon } from "@mui/icons-material/ConnectingAirportsOutlined";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as DocsIcon } from "@mui/icons-material/LibraryBooksOutlined";
import { default as LearningObjectivesIcon } from "@mui/icons-material/ListOutlined";
import { default as AnnexesIcon } from "@mui/icons-material/PanoramaOutlined";
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
  AppButtonsContainer,
  GithubButton,
  HamburgerButton,
  ThemeButton,
  BugReportButton,
  UserBugReport,
} from "@chair-flight/next/user";
import {
  AppLogo,
  Sidebar,
  SidebarListItem,
  useMediaQuery,
} from "@chair-flight/react/components";
import { usePageTransition } from "@chair-flight/react/components";
import { ThemeOverrideColorScheme } from "@chair-flight/react/theme";
import { trpc } from "@chair-flight/trpc/client";
import { container, getRequiredParam } from "@chair-flight/trpc/client";
import type { QuestionBankName } from "@chair-flight/core/question-bank";
import type { AppRouterOutput } from "@chair-flight/trpc/client";

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

type Data = AppRouterOutput["containers"]["layouts"]["getLayoutModule"];

export const LayoutModule = container<Props, Params, Data>(
  ({ children, fixedHeight, noPadding, questionBank, breadcrumbs, sx }) => {
    const { isTransitioning } = usePageTransition();
    const router = useRouter();
    const data = LayoutModule.useData({ questionBank });
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const { routes } = data;

    const isQuestions = router.asPath.includes("questions");
    const isTests = router.asPath.includes("tests");
    const isSettings = router.asPath.includes("settings");
    const isLearningObjectives = router.asPath.includes("learning-objectives");
    const isFlashcards = router.asPath.includes("flashcards");
    const isAnnexes = router.asPath.includes("annexes");
    const isDocs = router.asPath.includes("docs");
    const isHome =
      !isQuestions &&
      !isTests &&
      !isSettings &&
      !isFlashcards &&
      !isDocs &&
      !isLearningObjectives &&
      !isAnnexes;

    const secondToLastBreadcrumb = breadcrumbs?.at(-2);
    const lastBreadcrumb = breadcrumbs?.at(-1);

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
          {routes.home.isVisible && (
            <SidebarListItem
              href={routes.home.href}
              selected={isHome}
              icon={HomeIcon}
              title={"Home"}
            />
          )}
          {routes.tests.isVisible && (
            <SidebarListItem
              href={routes.tests.href}
              selected={isTests}
              icon={TestIcon}
              title={"Tests"}
            />
          )}
          {routes.questions.isVisible && (
            <SidebarListItem
              href={routes.questions.href}
              selected={isQuestions}
              icon={QuestionsIcon}
              title={"Questions"}
            />
          )}
          {routes.docs.isVisible && (
            <SidebarListItem
              href={routes.docs.href}
              selected={isDocs}
              icon={DocsIcon}
              title={"Docs"}
            />
          )}
          {routes.learningObjectives.isVisible && (
            <SidebarListItem
              href={routes.learningObjectives.href}
              selected={isLearningObjectives}
              icon={LearningObjectivesIcon}
              title={"Learning Objectives"}
            />
          )}
          {routes.annexes.isVisible && (
            <SidebarListItem
              href={routes.annexes.href}
              selected={isAnnexes}
              icon={AnnexesIcon}
              title={"Annexes"}
            />
          )}
          {routes.flashcards.isVisible && (
            <SidebarListItem
              href={routes.flashcards.href}
              selected={isFlashcards}
              icon={CardIcon}
              title={"Flash Cards"}
              sx={{ "& svg": { transform: "rotate(180deg)" } }}
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
          <AppButtonsContainer>
            <BugReportButton />

            <GithubButton />
            <ThemeButton />
            <HamburgerButton />
          </AppButtonsContainer>
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
            ...sx,
          }}
        />
        <UserBugReport />
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
  const router = helper.containers.layouts;
  const questionBank = getRequiredParam(params, "questionBank");
  return await router.getLayoutModule.fetch({ questionBank });
};

LayoutModule.useData = (params) => {
  const router = trpc.containers.layouts;
  const questionBank = getRequiredParam(params, "questionBank");
  return router.getLayoutModule.useSuspenseQuery({ questionBank })[0];
};
