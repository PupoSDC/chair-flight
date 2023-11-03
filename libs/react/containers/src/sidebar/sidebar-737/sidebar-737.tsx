import { useRouter } from "next/router";
import { default as AddCircleIcon } from "@mui/icons-material/AddCircle";
import { default as ConnectingAirportsIcon } from "@mui/icons-material/ConnectingAirports";
import { default as SearchIcon } from "@mui/icons-material/Search";
import {
  HEADER_HEIGHT,
  SidebarDrawer,
  SidebarDrawerListItem,
} from "@chair-flight/react/components";
import type { FunctionComponent } from "react";

const HEIGHT = `calc(100vh - ${HEADER_HEIGHT}px)`;

export const Sidebar737: FunctionComponent = () => {
  const router = useRouter();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isHome = !isQuestions && !isTests;

  return (
    <SidebarDrawer sx={{ height: HEIGHT }}>
      <SidebarDrawerListItem
        href={"/modules/737-type-rating"}
        selected={isHome}
        icon={ConnectingAirportsIcon}
        title={"Home"}
      />
      <SidebarDrawerListItem
        href={"/modules/737-type-rating/questions"}
        selected={isQuestions}
        icon={SearchIcon}
        title={"Search Questions"}
      />
      <SidebarDrawerListItem
        href={"/modules/737-type-rating/tests"}
        selected={isTests}
        icon={AddCircleIcon}
        title={"Create Test"}
      />
    </SidebarDrawer>
  );
};
