import { default as CardIcon } from "@mui/icons-material/StyleOutlined";
import { Box, GlobalStyles, listItemContentClasses } from "@mui/joy";
import {
  AppLogo,
  Sidebar,
  SidebarListItem,
  getGlobalColorScheme,
} from "@chair-flight/react/components";
import type { FunctionComponent, ReactNode } from "react";

export type LayoutModulePrepProps = {
  children: ReactNode;
  fixedHeight?: boolean;
  noPadding?: boolean;
};

export const LayoutModulePrep: FunctionComponent<LayoutModulePrepProps> = ({
  children,
  fixedHeight,
  noPadding,
}) => (
  <>
    <GlobalStyles
      styles={(t) => {
        return getGlobalColorScheme(t.colorSchemes.light.palette.primaryTeal);
      }}
    />
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
        href={"/modules/prep/flashcards"}
        selected={true}
        icon={CardIcon}
        title={"Tests"}
        sx={{
          "& svg": {
            transform: "rotate(180deg)",
          },
        }}
      />
    </Sidebar>
    <Box
      component="main"
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
