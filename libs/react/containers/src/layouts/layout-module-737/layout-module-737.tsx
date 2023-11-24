import { type FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import { default as TestIcon } from "@mui/icons-material/FlightTakeoffOutlined";
import { default as QuestionsIcon } from "@mui/icons-material/QuizOutlined";
import { default as SettingsIcon } from "@mui/icons-material/SettingsOutlined";
import { Box, listItemContentClasses } from "@mui/joy";
import {
  AppLogo,
  Sidebar,
  SidebarListItem,
  useThemeSwitcher,
} from "@chair-flight/react/components";

export type LayoutModule737Props = {
  children: React.ReactNode;
  fixedHeight?: boolean;
  noPadding?: boolean;
};

export const LayoutModule737: FunctionComponent<LayoutModule737Props> = ({
  children,
  fixedHeight,
  noPadding,
}) => {
  const [, setCurrentTheme] = useThemeSwitcher();
  const router = useRouter();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isSettings = router.asPath.includes("settings");

  useEffect(() => setCurrentTheme("rose"), [setCurrentTheme]);

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
              fontSize: 24,
              marginLeft: "-2px",
              marginRight: "2px",
            },
            [`& .${listItemContentClasses.root}`]: {
              fontWeight: 700,
              letterSpacing: "0.05rem",
              color: (t) => t.vars.palette.neutral.plainColor,
            },
          }}
        />
        <SidebarListItem
          href={"/modules/737/tests"}
          selected={isTests}
          icon={TestIcon}
          title={"Tests"}
        />
        <SidebarListItem
          href={"/modules/737/questions"}
          selected={isQuestions}
          icon={QuestionsIcon}
          title={"Questions"}
        />
        <SidebarListItem
          bottom
          href={"/modules/737/settings"}
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
