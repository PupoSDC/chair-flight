import { type FunctionComponent } from "react";
import { useRouter } from "next/router";
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

export const LayoutModuleAtpl: FunctionComponent<{
  children: React.ReactNode;
  fixedHeight?: boolean;
  noPadding?: boolean;
}> = ({ children, fixedHeight, noPadding }) => {
  const router = useRouter();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isLearningObjectives = router.asPath.includes("learning-objectives");
  const isSettings = router.asPath.includes("settings");

  return (
    <>
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
              color: (t) => t.palette.neutral.plainColor,
            },
          }}
        />
        <SidebarListItem
          href={"/modules/atpl/tests"}
          selected={isTests}
          icon={TestIcon}
          title={"Tests"}
        />
        <SidebarListItem
          href={"/modules/atpl/questions"}
          selected={isQuestions}
          icon={QuestionsIcon}
          title={"Questions"}
        />
        <SidebarListItem
          href={"/modules/atpl/learning-objectives"}
          selected={isLearningObjectives}
          icon={LearningObjectivesIcon}
          title={"Learning Objectives"}
        />
        <SidebarListItem
          bottom
          href={"/modules/atpl/settings"}
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
          ...(fixedHeight ? { height: "100vh" } : { minHeight: "100vh" }),
        }}
      />
    </>
  );
};
