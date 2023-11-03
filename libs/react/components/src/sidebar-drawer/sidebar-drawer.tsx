import { forwardRef, useState } from "react";
import { Global } from "@emotion/react";
import { ChevronRight } from "@mui/icons-material";
import { default as ChevronLeftIcon } from "@mui/icons-material/ChevronLeft";
import {
  Box,
  Button,
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
import type { SheetProps } from "@mui/joy";
import type { ReactElement } from "react";

export type SidebarDrawerProps = {
  children: ReactElement<SidebarDrawerListItemProps>[];
} & SheetProps;

export const SidebarDrawer = forwardRef<HTMLDivElement, SidebarDrawerProps>(
  ({ children = [], ...otherProps }, ref) => {
    const [isToggled, setIsToggled] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const cssVars = theme.dimensions.vars;
    const cssValues = theme.dimensions.values;

    return (
      <>
        <Global
          styles={{
            body: {
              [theme.breakpoints.up("md")]: {
                "--chevron-transform": isToggled
                  ? "rotate(-180deg)"
                  : "rotate(0deg)",
                [cssVars.sidebarWidth]: isToggled
                  ? `${cssValues.sidebarCollapsedWidth}px`
                  : `${cssValues.sidebarExpandedWidth}px`,
                [cssVars.sidebarRemainingWidth]: `calc(100vw - var(${cssVars.sidebarWidth}))`,
              },

              [theme.breakpoints.down("md")]: {
                "--chevron-transform": isToggled
                  ? "rotate(0deg)"
                  : "rotate(-180deg)",
                [cssVars.sidebarWidth]: isToggled
                  ? `${cssValues.sidebarExpandedWidth}px`
                  : `${cssValues.sidebarCollapsedWidth}px`,
                [cssVars.sidebarRemainingWidth]: `calc(100vw - var(${cssVars.sidebarWidth}))`,
              },

              [theme.breakpoints.down("sm")]: {
                [cssVars.sidebarWidth]: isToggled
                  ? `${cssValues.sidebarExpandedWidth}px`
                  : `0px`,
                [cssVars.sidebarRemainingWidth]: "calc(100vw - 16px)",
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
            width: `var(${cssVars.sidebarWidth})`,
            overflow: "auto",
            borderTop: 0,
            borderBottom: 0,
            borderLeft: 0,
            borderRadius: 0,
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
              transform: "var(--chevron-transform)",
            },

            ...otherProps.sx,
          }}
        >
          <List
            onClick={(e) => {
              if (!(e.target instanceof HTMLAnchorElement)) return;
              if (isSmallScreen) setIsToggled(false);
            }}
          >
            {children}
            <Box sx={{ flex: 1 }} />
            <ListItemButton
              variant="outlined"
              onClick={() => setIsToggled((t) => !t)}
              className="toggle-button"
            >
              <ListItemDecorator>
                <ChevronLeftIcon className="chevron" />
              </ListItemDecorator>
              <ListItemContent>Collapse</ListItemContent>
            </ListItemButton>
          </List>
        </Sheet>
        {!isToggled && (
          <Button
            onClick={() => setIsToggled(true)}
            sx={(t) => ({
              position: "fixed",
              bottom: t.spacing(0.5),
              zIndex: t.zIndex.modal - 1,
              left: 0,
              borderRadius: 0,
              borderTopRightRadius: "50%",
              borderBottomRightRadius: "50%",
              height: t.spacing(5),
              width: t.spacing(2),
              p: 0,

              [t.breakpoints.up("md")]: {
                display: "none",
              },
            })}
          >
            <ChevronRight fontSize="sm" />
          </Button>
        )}
        <Box
          aria-hidden
          onClick={() => setIsToggled(false)}
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
            display: isToggled && isSmallScreen ? "block" : "none",
          })}
        />
      </>
    );
  },
);

SidebarDrawer.displayName = "SidebarDrawer";
