import { useRef, type FunctionComponent } from "react";
import { useRouter } from "next/router";
import { default as AddCircleIcon } from "@mui/icons-material/AddCircle";
import { default as ConnectingAirportsIcon } from "@mui/icons-material/ConnectingAirports";
import { default as SearchIcon } from "@mui/icons-material/Search";
import { Box } from "@mui/joy";
import {
  Header,
  Sidebar,
  SidebarListItem,
} from "@chair-flight/react/components";
import type { HeaderProps, SidebarRef } from "@chair-flight/react/components";
import type { BoxProps } from "@mui/joy";

export const LayoutModule737: FunctionComponent<{
  children: React.ReactNode;
  fixedHeight?: boolean;
  slots?: {
    header?: HeaderProps;
    main?: BoxProps;
  };
}> = ({ children, fixedHeight, slots }) => {
  const sidebarRef = useRef<SidebarRef>(null);
  const router = useRouter();
  const isQuestions = router.asPath.includes("questions");
  const isTests = router.asPath.includes("tests");
  const isHome = !isQuestions && !isTests;
  const sidebarHeight = `calc(100vh - ${Header.css.headerHeight})`;
  const openMenu = () => sidebarRef.current?.toggleDrawer();

  return (
    <>
      <Header
        borderStyle="outlined"
        onHamburgerClick={openMenu}
        {...slots?.header}
      />
      <Sidebar sx={{ height: sidebarHeight }} ref={sidebarRef}>
        <SidebarListItem
          href={"/modules/737-type-rating"}
          selected={isHome}
          icon={ConnectingAirportsIcon}
          title={"Home"}
        />
        <SidebarListItem
          href={"/modules/737-type-rating/questions"}
          selected={isQuestions}
          icon={SearchIcon}
          title={"Search Questions"}
        />
        <SidebarListItem
          href={"/modules/737-type-rating/tests"}
          selected={isTests}
          icon={AddCircleIcon}
          title={"Create Test"}
        />
      </Sidebar>
      <Box
        component={"main"}
        children={children}
        {...slots?.main}
        sx={{
          width: Sidebar.css.remainingWidth,
          transition: Sidebar.css.widthTransition,
          marginLeft: "auto",
          p: { xs: 0.5, md: 2 },
          ...(fixedHeight
            ? { height: sidebarHeight }
            : { minHeight: sidebarHeight }),
          ...slots?.main?.sx,
        }}
      />
    </>
  );
};
