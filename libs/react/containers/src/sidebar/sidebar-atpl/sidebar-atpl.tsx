import { useRouter } from "next/router";
import { default as AddCircleIcon } from "@mui/icons-material/AddCircle";
import { default as ConnectingAirportsIcon } from "@mui/icons-material/ConnectingAirports";
import { default as FormatListBulletedIcon } from "@mui/icons-material/FormatListBulleted";
import { default as SearchIcon } from "@mui/icons-material/Search";
import {
  HEADER_HEIGHT,
  SidebarDrawer,
  SidebarDrawerListItem,
} from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

export const SidebarAtpl: FunctionComponent = () => {
  const router = useRouter();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isLearningObjectives = router.asPath.includes("learning-objectives");
  const isHome = !isQuestions && !isTests;

  return (
    <SidebarDrawer sx={{ height: HEIGHT }}>
      <SidebarDrawerListItem
        href={"/modules/atpl-theory"}
        selected={isHome}
        icon={ConnectingAirportsIcon}
        title={"Home"}
      />
      <SidebarDrawerListItem
        href={"/modules/atpl-theory/questions"}
        selected={isQuestions}
        icon={SearchIcon}
        title={"Questions"}
      />
      <SidebarDrawerListItem
        href={"/modules/atpl-theory/learning-objectives"}
        selected={isLearningObjectives}
        icon={FormatListBulletedIcon}
        title={"Learning Objectives"}
      />
      <SidebarDrawerListItem
        href={"/modules/atpl-theory/tests"}
        selected={isTests}
        icon={AddCircleIcon}
        title={"Create Test"}
      />
    </SidebarDrawer>
  );
};
