import { forwardRef } from "react";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import {
  Box,
  GlobalStyles,
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
import { create } from "zustand";
import { useMediaQuery } from "../hooks/use-media-query";
import type { SidebarListItemProps } from "./sidebar-list-item";
import type { SheetProps } from "@mui/joy";
import type { ReactElement } from "react";

export type SidebarProps = {
  children: ReactElement<SidebarListItemProps>[];
  sx?: SheetProps["sx"];
  className?: SheetProps["className"];
};

export type SidebarComponent = React.ForwardRefExoticComponent<
  SidebarProps & React.RefAttributes<HTMLDivElement>
> & {
  css: {
    remainingWidth: string;
    widthTransition: string;
  };
};

const VAR_SIDEBAR_WIDTH = "--joy-sidebar-width";
const VAR_SIDEBAR_REMAINING_WIDTH = "--joy-sidebar-remaining-width";
const SIDEBAR_EXPANDED_WIDTH = 210;
const SIDEBAR_COLLAPSED_WIDTH = 42;
const SIDEBAR_MOBILE_COLLAPSED_WIDTH = 24;

const useSidebarStore = create<{
  isMobileOpen: boolean;
  isDesktopOpen: boolean;
  setMobileOpen: (isMobileOpen: boolean) => void;
  setDesktopOpen: (isDesktopOpen: boolean) => void;
}>((set) => ({
  isMobileOpen: false,
  isDesktopOpen: true,
  setMobileOpen: (isMobileOpen) => set({ isMobileOpen }),
  setDesktopOpen: (isDesktopOpen) => set({ isDesktopOpen }),
}));

export const useSidebar = () => {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const openSidebar = () => setMobileOpen(true);
  return { openSidebar };
};

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children = [], ...otherProps }, ref) => {
    const { isMobileOpen, isDesktopOpen, setMobileOpen, setDesktopOpen } =
      useSidebarStore();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isOpen = isSmallScreen ? isMobileOpen : isDesktopOpen;
    const setOpen = isSmallScreen ? setMobileOpen : setDesktopOpen;

    return (
      <>
        <GlobalStyles
          styles={{
            body: {
              [theme.breakpoints.up("sm")]: {
                [VAR_SIDEBAR_REMAINING_WIDTH]: `calc(100vw - var(${VAR_SIDEBAR_WIDTH}))`,
                [VAR_SIDEBAR_WIDTH]: isDesktopOpen
                  ? `${SIDEBAR_EXPANDED_WIDTH}px`
                  : `${SIDEBAR_COLLAPSED_WIDTH}px`,
              },

              [theme.breakpoints.down("sm")]: {
                [VAR_SIDEBAR_REMAINING_WIDTH]: `calc(100vw - ${SIDEBAR_MOBILE_COLLAPSED_WIDTH}px)`,
                [VAR_SIDEBAR_WIDTH]: isMobileOpen
                  ? `${SIDEBAR_EXPANDED_WIDTH}px`
                  : `${SIDEBAR_MOBILE_COLLAPSED_WIDTH}px`,
              },
            },
          }}
        />
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
            borderRightWidth: 1,
            transition: "width 250ms",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            zIndex: "modal",
            overflowX: "hidden",

            [`& .${listClasses.root}`]: {
              p: 0,
            },

            [`& .${listItemContentClasses.root}`]: {
              textWrap: "nowrap",
              overflowY: "hidden",
            },

            [`& .${listItemButtonClasses.root}`]: {
              p: { xs: 0.125, sm: 1 },
              borderRight: 0,
              borderLeftWidth: { xs: 0, sm: 4 },
              borderLeftColor: "transparent",

              "&:first-of-type": {
                borderTop: 0,
              },

              "& + .filler": {
                borderBottom: "1px",
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
              fontSize: 20,
              transitionDuration: "250ms",
              transform: {
                xs: isMobileOpen ? "rotate(0deg)" : "rotate(-180deg)",
                sm: isDesktopOpen ? "rotate(0deg)" : "rotate(-180deg)",
              },
            },

            ...otherProps.sx,
          }}
        >
          <List onClick={() => isMobileOpen && setMobileOpen(false)}>
            {children.filter((c) => !c.props.bottom)}
            <Box sx={{ flex: 1 }} className="filler" />
            {children.filter((c) => c.props.bottom)}
            <ListItemButton
              variant="outlined"
              onClick={() => setOpen(!isOpen)}
              className="toggle-button"
            >
              <ListItemDecorator>
                <ChevronLeftIcon className="chevron" />
              </ListItemDecorator>
              <ListItemContent>Collapse</ListItemContent>
            </ListItemButton>
          </List>
        </Sheet>
        <Box
          className="backdrop"
          aria-hidden
          onClick={() => setMobileOpen(false)}
          sx={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "var(--joy-palette-background-backdrop)",
            backdropFilter: "blur(8px)",
            zIndex: (t) => t.zIndex.modal - 1,
            opacity: 1,
            display: isSmallScreen && isMobileOpen ? "block" : "none",
          }}
        />
      </>
    );
  },
) as SidebarComponent;

Sidebar.displayName = "Sidebar";
Sidebar.css = {
  remainingWidth: `var(${VAR_SIDEBAR_REMAINING_WIDTH})`,
  widthTransition: "width 250ms",
};
