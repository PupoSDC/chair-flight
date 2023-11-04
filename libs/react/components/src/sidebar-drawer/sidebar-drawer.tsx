import { forwardRef, useImperativeHandle, useState } from "react";
import { Global } from "@emotion/react";
import styled from "@emotion/styled";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import type {
  SheetProps} from "@mui/joy";
import {
  Box,
  List,
  ListItemButton,
  ListItemContent,
  ListItemDecorator,
  Sheet,
  listClasses,
  listItemButtonClasses,
  listItemContentClasses,
  useTheme,
} from "@mui/joy";
import { HEADER_HEIGHT } from "../constants";
import { useMediaQuery } from "../hooks/use-media-query";
import type { SidebarDrawerListItemProps } from "./sidebar-drawer-list-item";
import type { ReactElement } from "react";

export type SidebarDrawerProps = {
  children: ReactElement<SidebarDrawerListItemProps>[];
  sx?: SheetProps["sx"];
  className?: SheetProps["className"];
};

export type SidebarDrawerRef = HTMLDivElement & {
  toggleDrawer: () => void;
};

export type SidebarDrawerComponent = React.ForwardRefExoticComponent<
  SidebarDrawerProps & React.RefAttributes<SidebarDrawerRef>
> & {
  css: {
    remainingWidth: string;
    widthTransition: string;
  };
};

const VAR_SIDEBAR_WIDTH = "--joy-sidebar-drawer-width";
const VAR_SIDEBAR_REMAINING_WIDTH = "--joy-sidebar-drawer-remaining-width";
const SIDEBAR_EXPANDED_WIDTH = 240;
const SIDEBAR_COLLAPSED_WIDTH = 56;

export const SidebarDrawer = forwardRef<HTMLDivElement, SidebarDrawerProps>(
  ({ children = [], ...otherProps }, ref) => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isDesktopOpen, setDesktopOpen] = useState(true);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isOpen = isSmallScreen ? isMobileOpen : isDesktopOpen;

    useImperativeHandle(
      ref,
      () =>
        ({
          toggleDrawer: () => setIsMobileOpen((t) => !t),
        }) as SidebarDrawerRef,
    );

    return (
      <Sheet
        {...otherProps}
        ref={ref}
        component="nav"
        sx={{
          position: "fixed",
          height: "100%",
          width: `var(${VAR_SIDEBAR_WIDTH})`,
          overflow: "auto",
          borderTop: 0,
          borderBottom: 0,
          borderLeft: 0,
          borderRadius: 0,
          borderRightWidth: { xs: 0, sm: 1 },
          transition: "width 250ms",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: "modal",

          [`& .${listClasses.root}`]: {
            p: 0,
          },

          [`& .${listItemContentClasses.root}`]: {
            textWrap: "nowrap",
            overflowY: "hidden",
          },

          [`& .${listItemButtonClasses.root}`]: {
            py: { xs: 1, sm: 2 },
            borderRight: 0,
            borderLeft: 4,
            borderLeftColor: "transparent",

            "&:first-of-type": {
              borderTop: 0,
            },
            "&:not(:last-of-type)": {
              borderBottom: 0,
            },
            "&:hover": {
              textDecoration: "none",
            },
            "&:focus-visible": {
              outline: "none !important",
              textDecoration: "underline",
            },
            [`&.${listItemButtonClasses.selected}`]: {
              color: "var(--joy-palette-primary-plainColor)",
              borderLeftColor: "var(--joy-palette-primary-plainColor)",
              bgcolor: "transparent",
            },
          },

          ["& .chevron"]: {
            fontSize: 24,
            transitionDuration: "250ms",
            transform: isOpen ? "rotate(0deg)" : "rotate(-180deg)",
          },

          ...otherProps.sx,
        }}
      >
        <Global
          styles={{
            body: {
              [theme.breakpoints.up("sm")]: {
                [VAR_SIDEBAR_WIDTH]: isDesktopOpen
                  ? `${SIDEBAR_EXPANDED_WIDTH}px`
                  : `${SIDEBAR_COLLAPSED_WIDTH}px`,
                [VAR_SIDEBAR_REMAINING_WIDTH]: `calc(100vw - var(${VAR_SIDEBAR_WIDTH}))`,
              },

              [theme.breakpoints.down("sm")]: {
                [VAR_SIDEBAR_WIDTH]: isMobileOpen
                  ? `${SIDEBAR_COLLAPSED_WIDTH}px`
                  : "0px",
                [VAR_SIDEBAR_REMAINING_WIDTH]: "100vw",
              },
            },
          }}
        />
        <List onClick={() => setIsMobileOpen(false)}>
          {children}
          <Box sx={{ flex: 1 }} />
          <ListItemButton
            variant="outlined"
            onClick={() => setDesktopOpen((t) => !t)}
            className="toggle-button"
          >
            <ListItemDecorator>
              <ChevronLeftIcon className="chevron" />
            </ListItemDecorator>
            <ListItemContent>Collapse</ListItemContent>
          </ListItemButton>
        </List>
        <Box
          className="backdrop"
          aria-hidden
          onClick={() => setIsMobileOpen(false)}
          sx={(t) => ({
            position: "fixed",
            top: HEADER_HEIGHT,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "var(--joy-palette-background-backdrop)",
            backdropFilter: "blur(8px)",
            zIndex: t.zIndex.modal - 1,
            opacity: 1,
            display: isSmallScreen && isMobileOpen ? "block" : "none",
          })}
        />
      </Sheet>
    );
  },
) as SidebarDrawerComponent;

export const SidebarCompanionBox = styled(Box)`
  width: var(--joy-sidebar-drawer-remaining-width);
`;

SidebarDrawer.displayName = "SidebarDrawer";
SidebarDrawer.css = {
  remainingWidth: `var(${VAR_SIDEBAR_REMAINING_WIDTH})`,
  widthTransition: "width 250ms",
};
